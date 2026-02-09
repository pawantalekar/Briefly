interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    const renderContent = () => {

        const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
        const parts: (string | { type: 'image'; alt: string; src: string })[] = [];
        let lastIndex = 0;
        let match;

        while ((match = imageRegex.exec(content)) !== null) {

            if (match.index > lastIndex) {
                parts.push(content.substring(lastIndex, match.index));
            }

            parts.push({
                type: 'image',
                alt: match[1],
                src: match[2]
            });
            lastIndex = match.index + match[0].length;
        }


        if (lastIndex < content.length) {
            parts.push(content.substring(lastIndex));
        }

        return parts.map((part, index) => {
            if (typeof part === 'object' && part.type === 'image') {
                return (
                    <div key={index} className="my-6">
                        <img
                            src={part.src}
                            alt={part.alt}
                            className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23f3f4f6" width="600" height="400"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="18"%3EImage not available%3C/text%3E%3C/svg%3E';
                            }}
                        />
                        {part.alt && (
                            <p className="text-center text-sm text-gray-500 mt-2 italic">{part.alt}</p>
                        )}
                    </div>
                );
            }


            return (
                <div key={index}>
                    {(part as string).split('\n').map((line, lineIndex) => {

                        let cleanLine = line.trim();


                        if (cleanLine.startsWith('**') && cleanLine.endsWith('**')) {
                            cleanLine = cleanLine.substring(2, cleanLine.length - 2);
                        }
                        if (cleanLine.startsWith('*') && cleanLine.endsWith('*') && !cleanLine.startsWith('**')) {
                            cleanLine = cleanLine.substring(1, cleanLine.length - 1);
                        }


                        if (cleanLine.startsWith('### ')) {
                            return <h3 key={lineIndex} className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">{cleanLine.substring(4)}</h3>;
                        }
                        if (cleanLine.startsWith('## ')) {
                            return <h2 key={lineIndex} className="text-3xl font-bold text-[var(--text-primary)] mt-10 mb-5">{cleanLine.substring(3)}</h2>;
                        }
                        if (cleanLine.startsWith('# ')) {
                            return <h1 key={lineIndex} className="text-4xl font-bold text-[var(--text-primary)] mt-12 mb-6">{cleanLine.substring(2)}</h1>;
                        }


                        if (line.startsWith('> ')) {
                            return (
                                <blockquote key={lineIndex} className="border-l-4 border-primary-500 pl-4 py-2 my-4 italic text-[var(--text-secondary)] bg-[var(--bg-secondary)]">
                                    {line.substring(2)}
                                </blockquote>
                            );
                        }


                        if (line.startsWith('- ') || line.startsWith('* ')) {
                            return (
                                <li key={lineIndex} className="ml-6 my-2 text-[var(--text-primary)]">
                                    {formatInlineText(line.substring(2))}
                                </li>
                            );
                        }


                        if (line.trim()) {
                            return (
                                <p key={lineIndex} className="my-4 text-[var(--text-primary)] leading-relaxed text-lg">
                                    {formatInlineText(line)}
                                </p>
                            );
                        }

                        return <br key={lineIndex} />;
                    })}
                </div>
            );
        });
    };

    const formatInlineText = (text: string) => {
        let currentText = text;

        currentText = currentText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
        currentText = currentText.replace(/(?<!\*)\*([^\*]+?)\*(?!\*)/g, '<em class="italic">$1</em>');
        currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">$1</a>');

        return <span dangerouslySetInnerHTML={{ __html: currentText }} />;
    };

    return (
        <div className="prose prose-lg max-w-none">
            {renderContent()}
        </div>
    );
};

export default MarkdownRenderer;
