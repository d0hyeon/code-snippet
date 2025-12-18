
export function createCsvBuilder<const T extends string>(headers: T[] | readonly T[]) {
  const idx = [...headers].reduce((acc, header, idx) => ({ ...acc, [header]: idx }), {} as Record<T, number>);
  const body = [headers.join(',')];

  const buildRow = () => {
    const row = Array.from<string | number>({ length: headers.length }).fill('');

    const addColumn = (name: T, value: string | number) => {
      row[idx[name]] = value;
      return { addColumn, commit };
    };

    const commit = () => {
      body.push(row.join(', '));

      return { buildRow, addRow, toString: toText, toFile };
    };

    return { addColumn, commit };
  };

  const addRow = (columns: [T, string | number][]) => {
    const row = buildRow();
    columns.forEach(([name, value]) => {
      row.addColumn(name, value);
    });

    return row;
  };

  const toString = () => body.join('\n');
  const toFile = (fileName: string) => {
    const text = toString();

    return new File([text], fileName, { type: 'text/csv' });
  };

  return { buildRow, addRow, toString, toFile };
}