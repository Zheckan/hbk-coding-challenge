type TestIdFactory = (...arguments_: never[]) => string | number;

type TestIdDefinitions = Readonly<{
  [key: string]: true | TestIdFactory | TestIdDefinitions;
}>;

type DefinedTestIds<Definitions extends TestIdDefinitions> = {
  [Key in keyof Definitions]: Definitions[Key] extends true
    ? string
    : Definitions[Key] extends (
          ...arguments_: infer Arguments
        ) => string | number
      ? (...arguments_: Arguments) => string
      : Definitions[Key] extends TestIdDefinitions
        ? DefinedTestIds<Definitions[Key]>
        : never;
};

export function defineTestIds<const Definitions extends TestIdDefinitions>(
  definitions: Definitions,
): DefinedTestIds<Definitions> {
  return buildTestIds(definitions) as DefinedTestIds<Definitions>;
}

function buildTestIds(
  definitions: TestIdDefinitions,
  prefix?: string,
): Record<string, unknown> {
  const testIds: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(definitions)) {
    const testId = prefix === undefined ? key : `${prefix}-${key}`;

    if (value === true) {
      testIds[key] = testId;
      continue;
    }

    if (typeof value === "function") {
      testIds[key] = (...arguments_: never[]) =>
        `${testId}-${String(value(...arguments_))}`;
      continue;
    }

    testIds[key] = buildTestIds(value, testId);
  }

  return testIds;
}

export const testIds = defineTestIds({
  alerts: {
    details: {
      alertId: true,
    },
  },
});
