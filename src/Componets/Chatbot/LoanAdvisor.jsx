import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTimes, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import axios from 'axios';
import Groq from "groq-sdk";

// Initialize Groq
const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
});

const LoanAdvisor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi there! I'm your AI Loan Advisor. 👋 I can answer any questions about our loans, eligibility, or help you find the right package. Ask me anything!",
            sender: 'bot',
            type: 'text'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loanContext, setLoanContext] = useState(''); // Store formatted loan data
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isLoading]);

    // Fetch Loans for AI Context
    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const { data } = await axios.get(import.meta.env.VITE_API_URL + '/all-loans');
                // Format data for AI consumption
                const formattedLoans = data
                    .filter(loan => loan._id || loan.id) // Ensure ID exists
                    .map(loan => {
                        const maxAmount = loan.maxLoanLimit || loan.maxAmount || loan.maximumAmount || "Negotiable";
                        return `- ${loan.title} (ID: ${loan._id || loan.id}): Interest ${loan.interestRate}%, Max Amount ${maxAmount}, Category: ${loan.category}`;
                    }).join('\n');

                setLoanContext(formattedLoans);
            } catch (error) {
                console.error("Failed to fetch loans for AI:", error);
            }
        };
        fetchLoans();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user', type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `
                            You are a helpful and professional Loan Advisor assistant for 'LoanLinks', a loan service provider in Bangladesh.
                            Your goal is to help users find the best loan for their needs based on the REAL database below.

                            REAL LOAN DATABASE:
                            ${loanContext || "No loan data available currently."}

                            Guidance:
                            1. **Response Style:** Use Markdown. **Bold** key terms. Use lists for multiple options.
                            2. **Natural Tone:** Speak naturally like a human advisor. NEVER say "Based on our database", "According to real data", or similar robotic phrases. Just recommend the loans directly.
                            3. **Constraint:** Only recommend loans from the Context Data above. If you don't find a match, say "We currently don't have a loan package for that specific need."
                            4. **Linking:**
                               - Specific Loan: [Loan Title|Actual_Loan_ID] (e.g., [SME Loan|65f...])
                               - General Category: [Category Name] (e.g., [Business Loans])
                               - NEVER output "/loans/LoanID" or "/loans/undefined".
                            5. **Content Constraints:** 
                               - You MUST mention the "Max Loan Limit" exactly as it appears in the data (e.g., "Max Loan Limit: 500000").
                               - If the Limit says "Negotiable", say "Max Loan Limit: Negotiable".
                               - Do NOT say "undefined".
                        `
                    },
                    {
                        role: "user",
                        content: input
                    }
                ],
                model: "llama-3.3-70b-versatile",
            });

            const text = completion.choices[0]?.message?.content || "I'm having trouble understanding that completely.";

            const botMsg = { id: Date.now() + 1, text: text, sender: 'bot', type: 'text' };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg = { id: Date.now() + 1, text: "I'm having trouble connecting to my brain right now. 🧠 Please try again later.", sender: 'bot', type: 'text' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to process message text and render links
    const renderMessage = (text) => {
        if (typeof text !== 'string') return text;

        // Split by ANY bracketed content to catch malformed tags like [Title|]
        const parts = text.split(/(\[[^\]]+\])/g);

        return parts.map((part, index) => {
            // Flexible match: allows [Title|ID] or [Title|] or [Title]
            const match = part.match(/^\[([^|]+)\|?([^\]]*)\]$/);

            if (match) {
                const [_, rawTitle, rawId] = match;
                const title = rawTitle.trim();
                // Clean the ID if it exists
                let id = rawId ? rawId.replace(/ID:\s*/i, '').trim() : '';

                // Validate ID: if missing, 'undefined', 'null', or placeholder, render as CLICKABLE SEARCH FILTER
                if (!id || id.toLowerCase() === 'undefined' || id.toLowerCase() === 'null' || id.includes('...')) {
                    return (
                        <Link
                            key={index}
                            to={`/all-loans?search=${encodeURIComponent(title)}`}
                            className="font-medium text-[#B91116] hover:underline mx-1 cursor-pointer bg-red-50 px-2 py-0.5 rounded-md border border-red-100 inline-block my-1"
                            onClick={() => setIsOpen(false)}
                            title="Click to browse this category"
                        >
                            {title}
                        </Link>
                    );
                }

                // Valid ID -> Render Link
                return (
                    <Link
                        key={index}
                        to={`/loans/${id}`}
                        className="underline font-bold text-[#B91116] hover:text-[#900d11] mx-1 inline-block"
                        onClick={() => setIsOpen(false)}
                    >
                        {title}
                    </Link>
                );
            }

            // Render Markdown for text parts
            return (
                <span key={index} className="inline-block">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ node, ...props }) => <span className="inline" {...props} />,
                            strong: ({ node, ...props }) => <span className="font-bold text-gray-900" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2 text-left" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-2 text-left" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            a: ({ node, ...props }) => <a className="text-blue-600 underline" target="_blank" {...props} />
                        }}
                    >
                        {part}
                    </ReactMarkdown>
                </span>
            );
        });
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#B91116] text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:bg-[#900d11] transition-colors border-3 border-white"
            >
                {isOpen ? <FaTimes /> : <FaRobot />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col font-['Poppins']"
                    >
                        {/* Header */}
                        <div className="bg-[#B91116] p-4 flex justify-between items-center text-white shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <FaRobot className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Loan Advisor</h3>
                                    <div className="flex items-center gap-1 text-xs text-white/80">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        Online
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <FaMinus />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 min-h-0" data-lenis-prevent>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} `}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-[#B91116] text-white rounded-tr-none'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                        }`}>
                                        {/* Render Text or Component */}
                                        {renderMessage(msg.text)}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 italic flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-3 h-3 border-2 border-[#B91116] border-t-transparent rounded-full"
                                />
                                Thinking...
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your answer..."
                                    className="flex-1 input input-bordered input-sm focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] rounded-full px-4"
                                />
                                <button
                                    type="submit"
                                    className="w-8 h-8 rounded-full bg-[#B91116] text-white flex items-center justify-center hover:bg-[#900d11] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!input.trim()}
                                >
                                    <FaPaperPlane className="text-xs ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LoanAdvisor;
