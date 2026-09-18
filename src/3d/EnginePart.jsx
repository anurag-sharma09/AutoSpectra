import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { MATERIALS } from './materials';

// Cutaway material (transparent ghost shell)
const CUTAWAY_MAT = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#3a5070'),
  metalness: 0.3,
  roughness: 0.7,
  transparent: true,
  opacity: 0.12,
  side: THREE.DoubleSide,
});

/**
 * EnginePart
 * Wraps any set of meshes in a selectable, hoverable, cutaway-aware group.
 *
 * Props:
 *  partId          — unique string ID for this part
 *  partName        — human readable name
 *  defaultMaterial — THREE.Material to apply when unselected
 *  isShell         — if true, becomes transparent in cutaway mode
 *  selectedPartId  — currently selected part ID (from parent)
 *  onSelectPart    — callback(id, name)
 *  isCutaway       — global cutaway mode flag
 *  position / rotation — passed to <group>
 *  children        — mesh JSX
 */
export default function EnginePart({
  partId,
  partName,
  defaultMaterial,
  isShell = false,
  selectedPartId,
  onSelectPart,
  isCutaway = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  children,
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();

  const isSelected = selectedPartId === partId;

  // Compute which material the meshes should use
  const activeMaterial = useMemo(() => {
    if (isSelected) return MATERIALS.cyanHighlight;
    if (hovered)    return MATERIALS.redHighlight;
    if (isCutaway && isShell) return CUTAWAY_MAT;
    return defaultMaterial;
  }, [isSelected, hovered, isCutaway, isShell, defaultMaterial]);

  // Push material to all descendant meshes
  useEffect(() => {
    if (!groupRef.current || !activeMaterial) return;
    groupRef.current.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = activeMaterial;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [activeMaterial]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelectPart) onSelectPart(partId, partName);
  };

  const handleOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handleOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      {children}
    </group>
  );
}
