'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // ❌ 注释掉自动加载，初始列表为空
  // useEffect(() => {
  //   loadPapers();
  // }, []);

  const loadPapers = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.from('papers').select('*');
    setPapers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData);

    let keywords: string[] = [];
    if (data.keywords && typeof data.keywords === 'string') {
      keywords = data.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      const { error } = await supabase.from('papers').insert([
        {
          title: data.title,
          author: data.author,
          abstract: data.abstract,
          full_text: data.fullText || '', // ✅ 新增完整文章字段
          keywords: keywords,
        },
      ]);

      if (error) {
        alert('❌ 提交失败：' + error.message);
      } else {
        alert('✅ 论文提交成功！');
        if (formRef.current) formRef.current.reset();
        loadPapers(); // 提交后刷新列表
      }
    } catch (err) {
      alert('⚠️ 网络错误');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (paper.full_text && paper.full_text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* ===== ⚡P LOGO ===== */}
      <div className="fixed top-4 left-6 z-10">
        <div className="text-2xl font-bold tracking-tight">⚡P</div>
      </div>

      {/* ===== POWER 中心词宣言 ===== */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
          全世界都在教你如何“被爱”，<br />
          而 POWER，教你如何占有。
        </h1>

        <div className="text-lg md:text-xl space-y-6 text-left max-w-3xl mx-auto">
          <p>
            在这里，我们拒绝将一生的课题，简化为“如何被爱”；<br />
            拒绝在别人的棋盘上，耗尽一生去争夺一颗棋子；<br />
            拒绝做被挑选的玫瑰，要做，就做定义玫瑰的人。
          </p>

          <p>
            他们说，缺爱的女人，一生都在寻找救赎。<br />
            <strong className="font-bold">POWER 说，这是谎言。</strong>
          </p>

          <p>
            女性从未缺爱，我们只是被剥夺了“不爱”的权利，<br />
            以及“去爱”之外，所有人生的选项。<br />
            <strong className="font-bold">缺爱的本质，从来都是失权。</strong>
          </p>

          <p>
            他们说，权力是冰冷的，女人本该温柔。<br />
            <strong className="font-bold">POWER 说，那是因为他们惧怕你手握权力时的温度。</strong>
          </p>

          <p>
            <strong className="font-bold">权力，是女人最奢侈的护肤品。</strong><br />
            它不是让你变得坚硬，而是让你终于拥有柔软的余地。
          </p>

          <p>
            当权力在你手中：<br />
            “经营关系”，不再是小心翼翼的讨好，而是基于价值的平等互换；<br />
            “安全感”，不再来自他人的凝视，而源于你对自己命运的绝对掌控。
          </p>

          <p>
            在 POWER 的语境里，<br />
            “权力”从不止于财富与地位，<br />
            更是<strong className="font-bold">拒绝的权利</strong>——<br />
            是拒绝被定义、拒绝被凝视、拒绝情感绑架的绝对自由。
          </p>

          <p>
            当你真正拥有说“不”的权利，<br />
            全世界，才会开始认真听你说“是”。
          </p>

          <p>
            在 POWER，我们不歌颂残缺的爱，<br />
            <strong className="font-bold">我们只铸造完整的你。</strong>
          </p>

          <p>
            <strong className="font-bold">POWER——不为被爱，只为存在。</strong>
          </p>

          <p>
            从 POWER 到 THE POWER DYNASTY，<br />
            POWER 不是终点，<br />
            <strong className="font-bold">POWERNOVA，才是。</strong>
          </p>

          <p>
            当你如新星爆发，<br />
            不是为了照亮谁的夜空，<br />
            <strong className="font-bold">而是为了重塑自己的星系。</strong>
          </p>
        </div>
      </div>

      {/* ===== POWER 女性志 ===== */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">她们，就是 POWER</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "阿黛拉",
              tag: "法国影后 · #MeToo 火炬手",
              quote: "不要沉默，要燃烧。",
              desc: "她不是“受害者”，她是点火的人。2020年凯撒奖现场愤然离席，高喊：“你们在庆祝一个强奸犯！” 她早已看透：沉默不是美德，是共谋。"
            },
            {
              name: "papi酱",
              tag: "短视频女王 · 解构父权的段子手",
              quote: "我少女时代的英雄主义，就是敢说‘关你屁事’。",
              desc: "她用3分钟视频撕碎“女孩该温柔”的剧本。“剩女？我剩的是选择权！” 她的存在本身，就是对“乖乖女”叙事的一记耳光。"
            },
            {
              name: "林巧稚",
              tag: "万婴之母 · 中国妇产科奠基人",
              quote: "我的孩子，是五万个新生命。",
              desc: "一生未婚，亲手接生5万婴儿。她说：“我嫁给了一群孩子。” 她的权力，是让千万女性平安做母亲的能力。"
            }
          ].map((w, i) => (
            <div key={i} className="border p-5 rounded-lg hover:shadow transition">
              <h3 className="font-bold text-lg mb-1">{w.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{w.tag}</p>
              <blockquote className="text-sm italic border-l-2 border-blue-500 pl-2 mb-2">
                “{w.quote}”
              </blockquote>
              <p className="text-sm">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 论文提交（含完整文章） ===== */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">加入这场思想起义</h2>
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <input name="title" placeholder="标题 *" required className="w-full p-3 border rounded" />
          <input name="author" placeholder="作者 *" required className="w-full p-3 border rounded" />
          <textarea name="abstract" placeholder="摘要 *" required rows={3} className="w-full p-3 border rounded"></textarea>
          
          {/* ✅ 新增：完整文章 */}
          <textarea
            name="fullText"
            placeholder="完整文章（可选）——粘贴你的全文、诗歌、宣言或思考..."
            rows={8}
            className="w-full p-3 border rounded"
          ></textarea>

          <input name="keywords" placeholder="关键词（英文逗号分隔）" className="w-full p-3 border rounded" />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded ${loading ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'}`}
          >
            {loading ? '提交中...' : '提交论文'}
          </button>
        </form>
      </div>

      {/* ===== 论文列表（初始为空） ===== */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 搜索论文、作者、摘要或全文..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded"
          />
        </div>
        <h2 className="text-xl font-semibold mb-4">已收录思想 ({filteredPapers.length})</h2>
        {filteredPapers.length === 0 ? (
          <p className="text-gray-500">暂无论文</p>
        ) : (
          <div className="space-y-4">
            {filteredPapers.map((paper) => (
              <div key={paper.id} className="border p-4 rounded hover:bg-gray-50">
                <h3 className="font-bold">{paper.title}</h3>
                <p className="text-sm text-gray-600">作者：{paper.author}</p>
                <p className="text-sm mt-1">{paper.abstract.substring(0, 120)}...</p>
                {paper.full_text && (
                  <details className="mt-2 text-sm text-gray-700">
                    <summary className="cursor-pointer text-blue-600">查看全文</summary>
                    <div className="mt-1 whitespace-pre-wrap">{paper.full_text}</div>
                  </details>
                )}
                {paper.keywords?.length > 0 && (
                  <div className="mt-2 text-xs text-blue-600">
                    关键词：{paper.keywords.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}