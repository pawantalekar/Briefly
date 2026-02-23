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
            parts.push({ type: 'image', alt: match[1], src: match[2] });
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < content.length) {
            parts.push(content.substring(lastIndex));
        }

        return parts.map((part, index) => {
            if (typeof part === 'object' && part.type === 'image') {
                return (
                    <figure key={index} className="my-10">
                        <img
                            src={part.src}
                            alt={part.alt}
                            className="w-full h-auto rounded-xl shadow-xl mx-auto"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23f3f4f6" width="600" height="400"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="18"%3EImage not available%3C/text%3E%3C/svg%3E';
                            }}
                        />
                        {part.alt && (
                            <figcaption className="text-center text-sm text-[var(--text-secondary)] mt-3 italic">
                                {part.alt}
                            </figcaption>
                        )}
                    </figure>
                );
            }

            return (
                <div key={index}>
                    {(part as string).split('\n').map((line, lineIndex) => {
                        const cleanLine = line.trim();

                        if (cleanLine.startsWith('### ')) {
                            return (
                                <h3 key={lineIndex} className="text-xl md:text-2xl font-serif font-bold text-[var(--text-primary)] mt-10 mb-4 leading-snug">
                                    {cleanLine.substring(4)}
                                </h3>
                            );
                        }
                        if (cleanLine.startsWith('## ')) {
                            return (
                                <h2 key={lineIndex} className="article-h2">
                                    {cleanLine.substring(3)}
                                </h2>
                            );
                        }
                        if (cleanLine.startsWith('# ')) {
                            return (
                                <h1 key={lineIndex} className="text-3xl md:text-4xl font-serif font-black text-[var(--text-primary)] mt-16 mb-6 leading-tight">
                                    {cleanLine.substring(2)}
                                </h1>
                            );
                        }

                        if (line.startsWith('> ')) {
                            return (
                                <blockquote key={lineIndex} className="article-blockquote">
                                    {line.substring(2)}
                                </blockquote>
                            );
                        }

                        if (line.match(/^\d+\. /)) {
                            const num = line.match(/^(\d+)\. /)?.[1];
                            const text = line.replace(/^\d+\. /, '');
                            return (
                                <li key={lineIndex} className="flex gap-3 my-3 text-[var(--text-primary)] text-lg leading-relaxed list-none">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-sm font-bold">{num}</span>
                                    <span>{formatInlineText(text)}</span>
                                </li>
                            );
                        }

                        if (line.startsWith('- ') || line.startsWith('* ')) {
                            return (
                                <li key={lineIndex} className="flex gap-3 my-3 text-[var(--text-primary)] text-lg leading-relaxed list-none">
                                    <span className="flex-shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
                                    <span>{formatInlineText(line.substring(2))}</span>
                                </li>
                            );
                        }

                        if (cleanLine.startsWith('```')) {
                            return null;
                        }

                        if (line.trim()) {
                            return (
                                <p key={lineIndex} className="my-6 text-[var(--text-primary)] leading-[1.9] text-[1.1rem]">
                                    {formatInlineText(line)}
                                </p>
                            );
                        }

                        return <div key={lineIndex} className="h-2" />;
                    })}
                </div>
            );
        });
    };

    const formatInlineText = (text: string) => {
        let currentText = text;
        currentText = currentText.replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="font-bold text-[var(--text-primary)]">$1</strong>'
        );
        currentText = currentText.replace(
            /(?<!\*)\*([^\*]+?)\*(?!\*)/g,
            '<em class="italic text-[var(--text-secondary)]">$1</em>'
        );
        currentText = currentText.replace(
            /`([^`]+)`/g,
            '<code class="px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-[0.88em] font-mono border border-violet-200/60 dark:border-violet-700/40">$1</code>'
        );
        currentText = currentText.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" class="text-violet-600 dark:text-violet-400 underline underline-offset-4 decoration-violet-400/40 hover:decoration-violet-500 hover:text-violet-700 dark:hover:text-violet-300 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        return <span dangerouslySetInnerHTML={{ __html: currentText }} />;
    };

    return (
        <div className="article-content">
            {renderContent()}
        </div>
    );
};

export default MarkdownRenderer;
