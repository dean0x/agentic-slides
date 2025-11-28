import { describe, it, expect } from 'vitest';
import { iconRegistry, resolveIcon, getAvailableIcons } from './icons';

describe('Icon Registry', () => {
  describe('iconRegistry', () => {
    it('should contain registered icons', () => {
      expect(Object.keys(iconRegistry).length).toBeGreaterThan(0);
    });

    it('should have valid React components', () => {
      Object.values(iconRegistry).forEach(icon => {
        // React components can be functions or objects (forwardRef)
        const isValidComponent = typeof icon === 'function' ||
          (typeof icon === 'object' && icon !== null && '$$typeof' in icon);
        expect(isValidComponent).toBe(true);
      });
    });
  });

  describe('resolveIcon', () => {
    it('should resolve known icon names', () => {
      const brain = resolveIcon('Brain');
      expect(brain).toBeDefined();
      expect(brain).toBe(iconRegistry.Brain);
    });

    it('should return null for unknown icon names', () => {
      const result = resolveIcon('UnknownIcon');
      expect(result).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = resolveIcon(undefined);
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = resolveIcon('');
      expect(result).toBeNull();
    });
  });

  describe('getAvailableIcons', () => {
    it('should return array of icon names', () => {
      const icons = getAvailableIcons();
      expect(Array.isArray(icons)).toBe(true);
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should include common icons', () => {
      const icons = getAvailableIcons();
      expect(icons).toContain('Brain');
      expect(icons).toContain('Code');
      expect(icons).toContain('Home');
    });

    it('should match registry keys', () => {
      const icons = getAvailableIcons();
      const registryKeys = Object.keys(iconRegistry);
      expect(icons).toEqual(registryKeys);
    });
  });
});
