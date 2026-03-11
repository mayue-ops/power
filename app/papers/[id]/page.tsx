// app/papers/[id]/page.tsx

// 模拟论文数据（你可以替换成真实数据源）
const papers = [
  {
    id: '1',
    title: '女性与科技：打破隐形天花板',
    full_text:
      '在科技行业，女性长期面临“玻璃天花板”问题。本文探讨了结构性障碍、文化偏见以及可行的解决方案，呼吁建立更具包容性的创新生态。',
    keywords: ['科技', '性别平等', '职场'],
  },
  {
    id: '2',
    title: '身体自主权：从医疗到法律的边界',
    full_text:
      '身体自主权是女性基本人权的核心。本文分析了在生殖健康、医疗决策和法律保护方面的现状与挑战，并提出系统性改革建议。',
    keywords: ['身体自主', '法律', '医疗'],
  },
  {
    id: '3',
    title: '母职惩罚：被忽视的社会成本',
    full_text:
      '成为母亲不应成为职业发展的终点。本文通过数据分析揭示“母职惩罚”现象，并倡导政策支持与企业文化变革，让养育与事业不再对立。',
    keywords: ['母职', '职场歧视', '社会政策'],
  },
];

// 👇 关键：告诉 Next.js 需要为哪些 ID 生成静态页面
export async function generateStaticParams() {
  return papers.map((paper) => ({ id: paper.id }));
}

// 页面组件
export default function PaperDetail({ params }: { params: { id: string } }) {
  const paper = papers.find((p) => p.id === params.id);

  if (!paper) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">论文未找到</h1>
        <p>抱歉，没有找到 ID 为 {params.id} 的文章。</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{paper.title}</h1>
      <div className="prose prose-lg mb-6">
        <p>{paper.full_text}</p>
      </div>
      <div>
        <strong>关键词：</strong>
        <div className="mt-2 flex flex-wrap gap-2">
          {paper.keywords?.map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}