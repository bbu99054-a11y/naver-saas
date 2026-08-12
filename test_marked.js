import { marked } from 'marked';

async function test() {
  const input = `    <p>사업을 시작하거나</p>`;
  const output = await marked.parse(input);
  console.log(output);
}
test();
