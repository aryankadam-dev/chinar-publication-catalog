import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, MapPin, Share2, Heart, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export const revalidate = 60 // Revalidate this page every 60 seconds

export default async function BookDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    const { data: book, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !book) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1280px] mx-auto py-12 px-6 sm:px-8 lg:py-20">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">

                    {/* Left Column: Image */}
                    <div className="w-full md:w-[400px] flex-shrink-0">
                        <div className="relative w-full aspect-[2/3] rounded-sm group overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]">
                            {book.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={book.image_url}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center bg-[#f5f5f5]">
                                    <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                                    <p className="text-lg font-medium opacity-50">Image Coming Soon</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex-1 pt-4">

                        {/* Floated right buttons */}
                        <div className="hidden sm:flex float-right flex-col gap-3 ml-6 mb-6">
                            <Button variant="outline" size="icon" className="rounded-md h-11 w-11 bg-[#f0ebdf]/30 border-muted-foreground/20 text-[#4a4a4a] hover:bg-[#f0ebdf]/60 transition-colors shadow-sm">
                                <Heart className="h-5 w-5" />
                                <span className="sr-only">Wishlist</span>
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-md h-11 w-11 bg-[#f0ebdf]/30 border-muted-foreground/20 text-[#4a4a4a] hover:bg-[#f0ebdf]/60 transition-colors shadow-sm">
                                <Share2 className="h-5 w-5" />
                                <span className="sr-only">Share</span>
                            </Button>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-medium text-[#222222] leading-[1.1] mb-6 text-balance sm:pr-16">
                            {book.title}
                        </h1>

                        <h2 className="text-xl sm:text-[22px] font-sans text-[#444444] mb-8 font-normal tracking-wide">
                            {book.author}
                        </h2>

                        <div className="prose prose-stone max-w-none mb-10">
                            <p className="text-[16px] leading-[1.8] text-[#555555] text-pretty">
                                {book.description || 'A comprehensive guide published by Chinar Publication.'}
                            </p>
                            <button className="text-[#444] text-[15px] font-medium underline underline-offset-[6px] decoration-[#ccc] hover:decoration-[#444] transition-colors mt-2">
                                Read more
                            </button>
                        </div>

                        {/* Format Row - Mimicking the Price/Available In row */}
                        <div className="flex items-center gap-6 mb-10">
                            <div className="flex items-center gap-4">
                                <span className="text-[#666] text-[16px]">Available in:</span>
                                <div className="bg-[#f0ebdf]/40 px-5 py-2.5 rounded-md flex items-center gap-3 text-[15px] text-[#222] border border-[#e5dfd3]/60 shadow-sm cursor-pointer hover:bg-[#f0ebdf]/60 transition-colors">
                                    {book.format || 'Paperback'}
                                    <svg className="w-4 h-4 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Simple Metadata Row */}
                        <div className="flex items-center gap-8 mb-10 text-[16px] text-[#666]">
                            <div>Pages: {book.pages || 'N/A'}</div>
                            <div>Language: {book.language || 'Eng'}</div>
                        </div>

                        {/* Action/Samples Row (Simulated) */}
                        <div className="flex items-center gap-4 mb-12">
                            <span className="text-[#666] text-[16px]">Samples</span>
                            <button className="bg-[#f0ebdf]/40 px-6 py-2.5 rounded-md text-[15px] text-[#222] border border-[#e5dfd3]/60 shadow-sm hover:bg-[#f0ebdf]/60 transition-colors">
                                First Chapter
                            </button>
                        </div>

                        {/* Purchase Instructions (Replaces "Buy now on:") */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 pt-10 border-t border-[#eaeaea]">
                            <span className="text-[#666] text-[16px] whitespace-nowrap mt-1">
                                {book.stock_quantity > 0 && book.is_available ? 'Available at:' : 'Out of stock at:'}
                            </span>
                            <div className="flex-1 bg-white border border-[#eaeaea] rounded-md p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="h-4 w-4 text-[#cc0000]" />
                                    <span className="font-semibold text-[#222]">Chinar Publication Office</span>
                                </div>
                                <p className="text-[15px] text-[#555] leading-relaxed whitespace-pre-wrap">
                                    {book.purchase_instructions || "To purchase this book, please visit our main office on University Road or contact our sales representatives directly."}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
