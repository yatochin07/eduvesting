"use client";

import { useEffect, useRef, useState } from "react";
import { NeatGradient } from "@firecms/neat";
import { useTheme } from "next-themes";

const MOBILE_BREAKPOINT = 768; // px, samain dengan breakpoint 'md' di Tailwind

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setMounted(true), []);

  // Deteksi ukuran layar, update kalau di-resize (misal rotate HP / resize window)
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !mounted) return;

    const currentTheme = resolvedTheme || theme || "dark";

    // ============================================================
    // DESKTOP CONFIG — TIDAK DIUBAH, PERSIS SEPERTI SEBELUMNYA
    // ============================================================
    const desktopBaseConfig = {
      speed: 4.5,
      horizontalPressure: 3,
      verticalPressure: 4,
      waveFrequencyX: 2.5,
      waveFrequencyY: 2.5,
      waveAmplitude: 6,
      shadows: 10,
      highlights: 1,
      colorBrightness: 1,
      colorSaturation: 0,
      wireframe: false,
      colorBlending: 3,
      backgroundAlpha: 0,
      grainScale: 4,
      grainSparsity: 0,
      grainIntensity: 0,
      grainSpeed: 0.5,
      resolution: 0.9,
      yOffset: 2125.7000122070312,
      yOffsetWaveMultiplier: 4,
      yOffsetColorMultiplier: 4,
      yOffsetFlowMultiplier: 10,
      flowDistortionA: 1.2,
      flowDistortionB: 1.8,
      flowScale: 1.5,
      flowEase: 0.25,
      flowEnabled: false,
      enableProceduralTexture: false,
      transparentTextureVoid: false,
      textureVoidLikelihood: 0.27,
      textureVoidWidthMin: 60,
      textureVoidWidthMax: 420,
      textureBandDensity: 1.2,
      textureColorBlending: 0.06,
      textureSeed: 333,
      textureEase: 0.5,
      proceduralBackgroundColor: '#130a2a',
      textureShapeTriangles: 20,
      textureShapeCircles: 15,
      textureShapeBars: 15,
      textureShapeSquiggles: 10,
      domainWarpEnabled: false,
      domainWarpIntensity: 0,
      domainWarpScale: 3,
      vignetteIntensity: 0.25,
      vignetteRadius: 0.35,
      fresnelEnabled: false,
      fresnelPower: 1.3,
      fresnelIntensity: 0,
      fresnelColor: '#ffffff',
      iridescenceEnabled: false,
      iridescenceIntensity: 0.8,
      iridescenceSpeed: 1.5,
      bloomIntensity: 0.1,
      bloomThreshold: 0.1,
      chromaticAberration: 3,
      shapeType: 'sphere' as const,
      shapeRotationX: -2.49,
      shapeRotationY: -0.89,
      shapeRotationZ: 0,
      shapeAutoRotateSpeedX: 1,
      shapeAutoRotateSpeedY: 1.2,
      sphereRadius: 21,
      torusRadius: 15,
      torusTube: 5,
      cylinderRadius: 10,
      cylinderHeight: 40,
      planeBend: 0,
      planeTwist: 0,
      silhouetteFade: 0.55,
      cylinderFade: 0.08,
      ribbonFade: 0.05,
      flatShading: false,
      cameraLock: false,
      cameraX: 22.5,
      cameraY: 0,
      cameraZ: 0,
      cameraRotationX: 0.86,
      cameraRotationY: -0.007,
      cameraRotationZ: 0,
      cameraZoom: 2.6,
    };

    const desktopDarkConfig = {
      ...desktopBaseConfig,
      colors: [
        { color: '#149BA5', enabled: true },
        { color: '#395CD0', enabled: true },
        { color: '#1150B2', enabled: true },
        { color: '#7735DF', enabled: true },
        { color: '#2231A3', enabled: true },
        { color: '#7D3295', enabled: true },
      ],
      backgroundColor: '#0a1328',
    };

    const desktopLightConfig = {
      ...desktopBaseConfig,
      colors: [
        { color: '#7FDBE3', enabled: true },
        { color: '#A6BCF2', enabled: true },
        { color: '#8FB4E8', enabled: true },
        { color: '#C7ABF2', enabled: true },
        { color: '#A2ABE8', enabled: true },
        { color: '#D2A8DE', enabled: true },
      ],
      backgroundColor: '#0a1328',
    };

    // ============================================================
    // MOBILE CONFIG — plane, flat shading, lebih ringan buat performa
    // & muat pas di layar sempit (sesuai config yang kamu kasih)
    // ============================================================
    const mobileBaseConfig = {
      speed: 2.5,
      horizontalPressure: 3,
      verticalPressure: 4,
      waveFrequencyX: 2,
      waveFrequencyY: 3,
      waveAmplitude: 5,
      shadows: 1,
      highlights: 5,
      colorBlending: 8,
      backgroundAlpha: 0, // tetap transparan, biar CSS gradient luar yang jadi dasar (konsisten sama desktop)
      grainScale: 0,
      grainSparsity: 0,
      grainIntensity: 0,
      grainSpeed: 1,
      resolution: 1,
      yOffset: -0.0999755859375,
      yOffsetWaveMultiplier: 4,
      yOffsetColorMultiplier: 4,
      yOffsetFlowMultiplier: 4,
      flowDistortionA: 0,
      flowDistortionB: 0,
      flowScale: 1,
      flowEase: 0,
      flowEnabled: true,
      enableProceduralTexture: false,
      transparentTextureVoid: false,
      textureVoidLikelihood: 0.45,
      textureVoidWidthMin: 200,
      textureVoidWidthMax: 486,
      textureBandDensity: 2.15,
      textureColorBlending: 0.01,
      textureSeed: 333,
      textureEase: 0.5,
      proceduralBackgroundColor: '#000000',
      textureShapeTriangles: 20,
      textureShapeCircles: 15,
      textureShapeBars: 15,
      textureShapeSquiggles: 10,
      domainWarpEnabled: false,
      domainWarpIntensity: 0,
      domainWarpScale: 3,
      vignetteIntensity: 0,
      vignetteRadius: 0.8,
      fresnelEnabled: false,
      fresnelPower: 2,
      fresnelIntensity: 0.5,
      fresnelColor: '#FFFFFF',
      iridescenceEnabled: false,
      iridescenceIntensity: 0.5,
      iridescenceSpeed: 1,
      bloomIntensity: 0,
      bloomThreshold: 0.7,
      chromaticAberration: 0,
      shapeType: 'plane' as const,
      shapeRotationX: 0,
      shapeRotationY: 0,
      shapeRotationZ: 0,
      shapeAutoRotateSpeedX: 0,
      shapeAutoRotateSpeedY: 0,
      sphereRadius: 15,
      torusRadius: 15,
      torusTube: 5,
      cylinderRadius: 10,
      cylinderHeight: 40,
      planeBend: 0,
      planeTwist: 0,
      silhouetteFade: 0.25,
      cylinderFade: 0.08,
      ribbonFade: 0.05,
      flatShading: true,
      cameraLock: true,
      cameraX: 0,
      cameraY: 0,
      cameraZ: 0,
      cameraRotationX: 0,
      cameraRotationY: 0,
      cameraRotationZ: 0,
      cameraZoom: 1,
    };

    // 🌙 Mobile Dark — persis warna yang kamu kasih
    const mobileDarkConfig = {
      ...mobileBaseConfig,
      colors: [
        { color: '#103455', enabled: true },
        { color: '#0E0F3A', enabled: true },
        { color: '#040721', enabled: true },
        { color: '#1D0D3A', enabled: true },
        { color: '#101455', enabled: true },
        { color: '#101E4F', enabled: true },
      ],
      backgroundColor: '#003FFF',
      colorBrightness: 1,
      colorSaturation: 7,
    };

    // ☀️ Mobile Light — versi tint terang dari palet yang sama, biar tetap senada dengan dark
    const mobileLightConfig = {
      ...mobileBaseConfig,
      colors: [
        { color: '#8FC7E8', enabled: true }, // tint dari #103455
        { color: '#9FA0E0', enabled: true }, // tint dari #0E0F3A
        { color: '#8B8FC9', enabled: true }, // tint dari #040721
        { color: '#B79FE0', enabled: true }, // tint dari #1D0D3A
        { color: '#94A0E8', enabled: true }, // tint dari #101455
        { color: '#94AEE8', enabled: true }, // tint dari #101E4F
      ],
      backgroundColor: '#c6d1f5',
      colorBrightness: 1.15,
      colorSaturation: 3,
    };

    // ============================================================
    // Pilih config sesuai device + theme
    // ============================================================
    let activeConfig;
    if (isMobile) {
      activeConfig = currentTheme === "dark" ? mobileDarkConfig : mobileLightConfig;
    } else {
      activeConfig = currentTheme === "dark" ? desktopDarkConfig : desktopLightConfig;
    }

    const gradient = new NeatGradient({
      ref: canvasRef.current,
      ...activeConfig,
    });

    return () => {
      gradient.destroy();
    };
  }, [theme, resolvedTheme, mounted, isMobile]);

  if (!mounted) return null;

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0a1328 0%, #0a1328 70%, #1f2955 100%)"
          : "linear-gradient(135deg, #c6d1f5 0%, #a4cef3 70%, #b094ff 100%)",
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}