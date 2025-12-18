# createCsvBuilder

CSV 파일을 보다 쉽게 생성하는 함수입니다.  
헤더 Column을 먼저 정의하여 타입 추론을 통한 오타 방지, 순서 보장을 지원합니다.

## example

```ts
const csvBuilder = createCsvBuilder(["ID", "이름"]);

csvBuilder.buildRow().addColumn("ID", 1).addColumn("이름", "홍길동").commit();
csvBuilder
  .addRow([
    ["ID", 2],
    ["이름", "홍길순"],
  ])
  .commit();

await downloadFile(csvBuilder.toFile("사용자_목록"));
// 혹은
return new Response(csvBuilder.toString(), {
  status: 200
  headers: { 'Content-Type': 'text/csv' }
});
```
