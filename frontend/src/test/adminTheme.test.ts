import { describe, it, expect } from 'vitest';
import {
  spoliTokens,
  lightAdminTheme,
  darkAdminTheme,
} from '../contexts/adminTheme';

describe('adminTheme: spoliTokens', () => {
  it('should expose the Spoli color palette', () => {
    expect(spoliTokens.m1).toBe('#141414');
    expect(spoliTokens.m2).toBe('#8A8A8A');
    expect(spoliTokens.m3).toBe('#FFFFFF');
    expect(spoliTokens.a1).toBe('#FF8473');
    expect(spoliTokens.a2).toBe('#FFE588');
    expect(spoliTokens.a3).toBe('#7152E1');
  });

  it('should expose admin sidebar colors', () => {
    expect(spoliTokens.adminSidebar).toBe('#1a1a2e');
    expect(typeof spoliTokens.adminSidebarDeep).toBe('string');
  });
});

describe('adminTheme: lightAdminTheme', () => {
  it('should be configured as a light theme', () => {
    expect(lightAdminTheme.palette.mode).toBe('light');
  });

  it('should use Spoli primary accent (#FF8473) as the MUI primary color', () => {
    expect(lightAdminTheme.palette.primary.main).toBe(spoliTokens.a1);
  });

  it('should use Spoli secondary accent (#7152E1) as the MUI secondary color', () => {
    expect(lightAdminTheme.palette.secondary.main).toBe(spoliTokens.a3);
  });

  it('should bind the dark text color to Spoli m-1 and the secondary text to m-2', () => {
    expect(lightAdminTheme.palette.text.primary).toBe(spoliTokens.m1);
    expect(lightAdminTheme.palette.text.secondary).toBe(spoliTokens.m2);
  });

  it('should bind paper background to Spoli white (#FFFFFF)', () => {
    expect(lightAdminTheme.palette.background.paper).toBe(spoliTokens.m3);
  });

  it('should use Inter as the primary font family', () => {
    expect(lightAdminTheme.typography.fontFamily).toContain('Inter');
  });

  it('should disable button text-transform per MUI conventions for admin UI', () => {
    expect(
      lightAdminTheme.typography.button?.textTransform ?? lightAdminTheme.components?.MuiButton?.styleOverrides?.root
    ).toBeDefined();
  });
});

describe('adminTheme: darkAdminTheme', () => {
  it('should be configured as a dark theme', () => {
    expect(darkAdminTheme.palette.mode).toBe('dark');
  });

  it('should keep the Spoli primary/secondary accents in dark mode', () => {
    expect(darkAdminTheme.palette.primary.main).toBe(spoliTokens.a1);
    expect(darkAdminTheme.palette.secondary.main).toBe(spoliTokens.a3);
  });

  it('should use a dark background and admin sidebar surface for paper', () => {
    expect(darkAdminTheme.palette.background.paper).toBe(spoliTokens.adminSidebar);
    expect(darkAdminTheme.palette.background.default).toBe('#0f0f1a');
  });

  it('should use white text in dark mode', () => {
    expect(darkAdminTheme.palette.text.primary).toBe(spoliTokens.m3);
  });

  it('should use Inter as the primary font family', () => {
    expect(darkAdminTheme.typography.fontFamily).toContain('Inter');
  });
});
