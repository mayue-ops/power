// app/page.tsx
'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [papers, setPapers] = useState<any[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 页面加载时获取论文
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchPapers = async () => {
      const { data, error } = await supabase.from('papers').select('*');
      if (error) {
        console.error('获取论文失败:', error);
      } else {
        setPapers(data || []);
        setFilteredPapers(data || []); // 初始显示全部
      }
      setLoading(false);
    };

    fetchPapers();
  }, []);

  // 搜索逻辑
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPapers(papers);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = papers.filter(paper =>
      paper.title.toLowerCase().includes(term) ||
      (paper.author && paper.author.toLowerCase().includes(term)) ||
      (paper.keywords && 
        paper.keywords.some((k: string) => k.toLowerCase().includes(term)))
    );
    setFilteredPapers(results);
  }, [searchTerm, papers]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const abstract = formData.get('abstract') as string;
    const keywordsInput = formData.get('keywords') as string;

    const keywords = keywordsInput
      ? keywordsInput.split(',').map(k => k.trim()).filter(k => k)
      : [];

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from('papers').insert({
      title,
      author,
      abstract,
      keywords,
    });

    if (error) {
      alert('❌ 提交失败：' + error.message);
    } else {
      alert('✅ 论文提交成功！');
      e.currentTarget.reset();

      // 重新加载论文
      const { data } = await supabase.from('papers').select('*');
      setPapers(data || []);
      setFilteredPapers(data || []);
    }
  };

  if (loading) {
    return <div className="p-8 text-lg">正在加载论文...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">POWER 论文库</h1>

      {/* 🔍 搜索框 */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 搜索论文（标题 / 作者 / 关键词）"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-500">
            找到 {filteredPapers.length} 篇相关论文
          </p>
        )}
      </div>

      {/* 论文列表 */}
      {filteredPapers.length > 0 ? (
        <ul className="space-y-6">
          {filteredPapers.map((paper) => (
            <li key={paper.id} className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/papers/${paper.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                {paper.title}
              </Link>
              <p className="mt-2"><strong>作者：</strong>{paper.author || '未知'}</p>
              <p className="mt-2"><strong>摘要：</strong>{paper.abstract?.substring(0, 150)}...</p>
              <p className="mt-2"><strong>关键词：</strong>
                {paper.keywords?.map((k: string) => (
                  <span key={k} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mt-1">
                    {k}
                  </span>
                )) || '暂无'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">未找到匹配的论文</p>
      )}

      {/* 提交表单 */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-4">提交新论文</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="论文标题"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="author"
            placeholder="作者姓名"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="abstract"
            placeholder="摘要（至少50字）"
            required
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="keywords"
            placeholder="关键词（用英文逗号分隔，如：AI, 教育, 未来）"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            提交论文
          </button>
        </form>
      </div>
    </div>
  );
}