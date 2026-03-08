'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function PaperDetail({ params }: { params: { id: string } }) {
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        // 创建 Supabase 客户端
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 查询论文
        const { data, error: fetchError } = await supabase
          .from('papers')
          .select('*')
          .eq('id', params.id)
          .single();

        if (fetchError) {
          console.error('Supabase 查询错误:', fetchError);
          setError('论文加载失败，请稍后再试。');
        } else if (!data) {
          setError('未找到该论文');
        } else {
          setPaper(data);
        }
      } catch (err) {
        console.error('意外错误:', err);
        setError('系统出错，请重试。');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPaper();
    } else {
      setLoading(false);
      setError('无效的论文 ID');
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p>正在加载论文...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{paper.title}</h1>
      <p className="mt-4"><strong>作者：</strong>{paper.author || '未知'}</p>
      <p className="mt-4"><strong>摘要：</strong>{paper.abstract}</p>
      <p className="mt-4"><strong>关键词：</strong>
        {paper.keywords?.map((k: string) => (
          <span
            key={k}
            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mt-1"
          >
            {k}
          </span>
        )) || '暂无'}
      </p>
    </div>
  );
}