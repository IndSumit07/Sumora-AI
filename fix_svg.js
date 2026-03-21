const fs = require('fs');
const file = './client/src/components/ui/database-with-rest-api.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Boxes with fill="#18181b" and stroke="#52525b"
content = content.replace(/<rect\s+width="(\d+)"\s+height="(\d+)"\s+rx="(\d+)"\s+stroke="#52525b"\s+strokeWidth="0\.6"\s+fill="#18181b"/g, '<rect width="$1" height="$2" rx="$3" strokeWidth="0.6" className="fill-white dark:fill-[#18181b] stroke-zinc-300 dark:stroke-[#52525b]"');

// 2. Texts with fill="#e2e8f0"
content = content.replace(/fill="#e2e8f0"/g, 'className="fill-zinc-800 dark:fill-[#e2e8f0]"');

// 3. Langchain Box
content = content.replace(/stroke="#0ea5e9"\s+strokeWidth="1\.2"\s+strokeDasharray="4 3"\s+fill="#111827"/g, 'stroke="#0ea5e9" strokeWidth="1.2" strokeDasharray="4 3" className="fill-sky-50 dark:fill-[#111827]"');
content = content.replace(/fill="#f8fafc"(\s+fontSize="7"\s+fontWeight="500"\s*>\s*Langchain Orchestration)/g, 'className="fill-sky-950 dark:fill-[#f8fafc]"$1');

// 4. Powered By Multi-Agent Box
content = content.replace(/stroke="#52525b"\s+strokeWidth="0\.6"\s+fill="#27272a"/g, 'strokeWidth="0.6" className="fill-zinc-100 dark:fill-[#27272a] stroke-zinc-300 dark:stroke-[#52525b]"');
content = content.replace(/fill="#e5e7eb"(\s+fontSize="5\.5"\s+fontWeight="500"\s*>\s*Powered by Multi-Agent AI)/g, 'className="fill-zinc-800 dark:fill-[#e5e7eb]"$1');

// 5. Inner badges
content = content.replace(/stroke="#3f3f46"\s+fill="#18181b"/g, 'className="fill-white dark:fill-[#18181b] stroke-zinc-300 dark:stroke-[#3f3f46]"');
content = content.replace(/fill="#d1d5db"/g, 'className="fill-zinc-800 dark:fill-[#d1d5db]"');

fs.writeFileSync(file, content);
console.log('done!');
