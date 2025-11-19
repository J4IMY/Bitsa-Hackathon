import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Quote,
    Code,
    Undo,
    Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Start writing...",
    className,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    const insertLink = () => {
        const url = prompt("Enter URL:");
        if (url) {
            executeCommand("createLink", url);
        }
    };

    const toolbarButtons = [
        {
            icon: <Bold className="h-4 w-4" />,
            command: "bold",
            title: "Bold (Ctrl+B)",
        },
        {
            icon: <Italic className="h-4 w-4" />,
            command: "italic",
            title: "Italic (Ctrl+I)",
        },
        {
            icon: <Underline className="h-4 w-4" />,
            command: "underline",
            title: "Underline (Ctrl+U)",
        },
        {
            icon: <Heading1 className="h-4 w-4" />,
            command: "formatBlock",
            value: "h1",
            title: "Heading 1",
        },
        {
            icon: <Heading2 className="h-4 w-4" />,
            command: "formatBlock",
            value: "h2",
            title: "Heading 2",
        },
        {
            icon: <List className="h-4 w-4" />,
            command: "insertUnorderedList",
            title: "Bullet List",
        },
        {
            icon: <ListOrdered className="h-4 w-4" />,
            command: "insertOrderedList",
            title: "Numbered List",
        },
        {
            icon: <Quote className="h-4 w-4" />,
            command: "formatBlock",
            value: "blockquote",
            title: "Quote",
        },
        {
            icon: <Code className="h-4 w-4" />,
            command: "formatBlock",
            value: "pre",
            title: "Code Block",
        },
        {
            icon: <LinkIcon className="h-4 w-4" />,
            onClick: insertLink,
            title: "Insert Link",
        },
        {
            icon: <Undo className="h-4 w-4" />,
            command: "undo",
            title: "Undo (Ctrl+Z)",
        },
        {
            icon: <Redo className="h-4 w-4" />,
            command: "redo",
            title: "Redo (Ctrl+Y)",
        },
    ];

    return (
        <div className={cn("border rounded-md overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b">
                {toolbarButtons.map((button, index) => (
                    <Button
                        key={index}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title={button.title}
                        onClick={(e) => {
                            e.preventDefault();
                            if (button.onClick) {
                                button.onClick();
                            } else {
                                executeCommand(button.command, button.value);
                            }
                        }}
                    >
                        {button.icon}
                    </Button>
                ))}
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={cn(
                    "min-h-[200px] max-h-[400px] overflow-y-auto p-4 prose prose-sm max-w-none focus:outline-none",
                    "prose-headings:mt-4 prose-headings:mb-2",
                    "prose-p:my-2",
                    "prose-ul:my-2 prose-ol:my-2",
                    "prose-li:my-1",
                    "prose-blockquote:my-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
                    "prose-pre:my-4 prose-pre:p-4 prose-pre:bg-muted prose-pre:rounded",
                    "prose-a:text-primary prose-a:underline",
                    !value && !isFocused && "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
                )}
                data-placeholder={placeholder}
                suppressContentEditableWarning
            />
        </div>
    );
}
