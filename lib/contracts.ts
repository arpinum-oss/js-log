export function contracts(t: any) {
  const LoggerContract = t.interface(
    {
      debug: t.Function,
      info: t.Function,
      warn: t.Function,
      error: t.Function
    },
    'LoggerContract'
  );

  return {
    LoggerContract
  };
}
