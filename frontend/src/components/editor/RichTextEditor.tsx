import { useState } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState('');


    const insertText = (before: string, after: string = '') => {
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);


        setTimeout(() => {
            textarea.focus();
            const newPosition = start + before.length + selectedText.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const insertImage = () => {
        if (!imageUrl.trim()) return;

        const imageMarkdown = `\n![Image](${imageUrl})\n`;
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newText = value.substring(0, start) + imageMarkdown + value.substring(start);

        onChange(newText);
        setImageUrl('');
        setShowImageDialog(false);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
        }, 0);
    };

    const formatButtons = [
        { label: 'H1', action: () => insertText('# ', '\n'), tooltip: 'Heading 1' },
        { label: 'H2', action: () => insertText('## ', '\n'), tooltip: 'Heading 2' },
        { label: 'H3', action: () => insertText('### ', '\n'), tooltip: 'Heading 3' },
        { label: 'B', action: () => insertText('**', '**'), tooltip: 'Bold', bold: true },
        { label: 'I', action: () => insertText('*', '*'), tooltip: 'Italic', italic: true },
        { label: 'Quote', action: () => insertText('> ', '\n'), tooltip: 'Quote' },
        { label: 'List', action: () => insertText('- ', '\n'), tooltip: 'Bullet List' },
        { label: 'Link', action: () => insertText('[', '](url)'), tooltip: 'Insert Link' },
    ];


    const renderPreview = () => {
        const imageRegex = /!\[.*?\]\((.*?)\)/g;
        const parts = value.split(imageRegex);

        return (
            <div className="prose max-w-none p-4 bg-gray-50 rounded-lg">
                {parts.map((part, index) => {

                    if (index % 2 === 1) {
                        return (
                            <div key={index} className="my-4">
                                <img
                                    src={part}
                                    alt="Content"
                                    className="max-w-full h-auto rounded-lg shadow-sm"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>
                        );
                    }
                    return (
                        <div key={index} className="whitespace-pre-wrap">
                            {part.split('\n').map((line, i) => {
                                if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold my-4">{line.substring(2)}</h1>;
                                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold my-3">{line.substring(3)}</h2>;
                                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold my-2">{line.substring(4)}</h3>;
                                if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-gray-300 pl-4 italic my-2">{line.substring(2)}</blockquote>;
                                if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.substring(2)}</li>;


                                const formattedLine = line
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary-600 hover:underline">$1</a>');

                                return <p key={i} className="my-1" dangerouslySetInnerHTML={{ __html: formattedLine || '<br/>' }} />;
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-4">

            <div className="bg-white border border-gray-300 rounded-lg p-3 flex flex-wrap gap-2">
                {formatButtons.map((btn, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={btn.action}
                        title={btn.tooltip}
                        className={`px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition ${btn.bold ? 'font-bold' : ''
                            } ${btn.italic ? 'italic' : ''}`}
                    >
                        {btn.label}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => setShowImageDialog(true)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition flex items-center gap-1"
                    title="Insert Image"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image
                </button>
            </div>


            {showImageDialog && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Insert Image</h4>
                        <button
                            type="button"
                            onClick={() => {
                                setShowImageDialog(false);
                                setImageUrl('');
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    insertImage();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={insertImage}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                        >
                            Insert
                        </button>
                    </div>
                </div>
            )}


            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-300 bg-gray-50">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium border-r border-gray-300 bg-white"
                    >
                        Write
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Preview
                    </button>
                </div>


                <textarea
                    id="content-editor"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}

                    rows={15}
                    className="w-full p-4 font-mono text-sm resize-none outline-none"
                    placeholder="Write your blog content here...

Use formatting buttons above or markdown:
# Heading 1
## Heading 2
### Heading 3
**bold text**
*italic text*
> quote
- list item
[link text](url)
![Image](image-url)"
                    required
                />
            </div>


            {value.includes('![') && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-700">Content Preview</span>
                    </div>
                    {renderPreview()}
                </div>
            )}


            <details className="text-sm text-gray-600">
                <summary className="cursor-pointer hover:text-gray-900">Formatting Guide</summary>
                <div className="mt-2 space-y-1 pl-4">
                    <p><code className="bg-gray-100 px-1 rounded"># Heading 1</code> - Large heading</p>
                    <p><code className="bg-gray-100 px-1 rounded">## Heading 2</code> - Medium heading</p>
                    <p><code className="bg-gray-100 px-1 rounded">### Heading 3</code> - Small heading</p>
                    <p><code className="bg-gray-100 px-1 rounded">**bold**</code> - Bold text</p>
                    <p><code className="bg-gray-100 px-1 rounded">*italic*</code> - Italic text</p>
                    <p><code className="bg-gray-100 px-1 rounded">&gt; quote</code> - Blockquote</p>
                    <p><code className="bg-gray-100 px-1 rounded">- item</code> - List item</p>
                    <p><code className="bg-gray-100 px-1 rounded">[text](url)</code> - Link</p>
                    <p><code className="bg-gray-100 px-1 rounded">![alt](url)</code> - Image</p>
                </div>
            </details>
        </div>
    );
};

export default RichTextEditor;
