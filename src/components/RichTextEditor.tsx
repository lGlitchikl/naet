'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, Image as ImageIcon, Heading } from 'lucide-react';
import { useState, useRef } from 'react';

export default function RichTextEditor({ 
  name, 
  defaultValue = '' 
}: { 
  name: string; 
  defaultValue?: string 
}) {
  // Скрытое поле, чтобы форма могла отправить HTML на сервер
  const [html, setHtml] = useState(defaultValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-slate-900 dark:text-white',
      },
    },
  });

  if (!editor) return null;

  // Функция для загрузки картинки с компьютера (сохраняет во временный URL)
  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-600 rounded-md overflow-hidden bg-white dark:bg-slate-900">
      {/* Скрытое поле для отправки формы */}
      <input type="hidden" name={name} value={html} />

      {/* Панель инструментов */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-700' : ''}`}>
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-700' : ''}`}>
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${editor.isActive('heading') ? 'bg-slate-200 dark:bg-slate-700' : ''}`}>
          <Heading className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-700' : ''}`}>
          <List className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />
        
        {/* Кнопка загрузки картинки */}
        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
          <ImageIcon className="w-4 h-4" />
        </button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={addImage} className="hidden" />
      </div>

      {/* Сам редактор */}
      <EditorContent editor={editor} />
    </div>
  );
}