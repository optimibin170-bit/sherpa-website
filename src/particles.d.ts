interface Window {
  pJSDom?: Array<{
    pJS: {
      fn: {
        vendors: {
          destroypJS: () => void;
        };
      };
    };
  }>;
  particlesJS?: (id: string, config: Record<string, unknown>) => void;
}
