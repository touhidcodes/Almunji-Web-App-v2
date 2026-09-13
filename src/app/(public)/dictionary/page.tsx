"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetDictionarySuggestionsQuery, useGetDictionaryWordQuery } from "@/redux/api/dictionaryApi";
import { Book, Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 500);

  const {
    data: suggestionsData,
    isLoading: isSuggestionsLoading,
    isFetching: isSuggestionsFetching,
  } = useGetDictionarySuggestionsQuery(
    { search: debouncedSearchTerm },
    { skip: !debouncedSearchTerm }
  );

  const { data: wordDetailsData, isLoading: isWordDetailsLoading } =
    useGetDictionaryWordQuery(selectedWordId || "", {
      skip: !selectedWordId,
    });

  const suggestions = (suggestionsData?.data as Array<{
    id: string;
    word?: string;
    persianWord?: string;
    pronunciation?: string;
    transliteration?: string;
    definition?: string;
    banglaMeaning?: string;
    englishMeaning?: string;
    meaning?: string;
    root?: string;
    examples?: string[];
    verses?: string[];
  }>) || [];
  const selectedWord = (wordDetailsData?.data as {
    id: string;
    word?: string;
    persianWord?: string;
    pronunciation?: string;
    transliteration?: string;
    definition?: string;
    banglaMeaning?: string;
    englishMeaning?: string;
    meaning?: string;
    root?: string;
    examples?: string[];
    verses?: string[];
  }) || null; 

  const handleWordSelect = (wordId: string) => {
    setSelectedWordId(wordId);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedWordId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedWordId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Almunji</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-teal-600 font-medium">
                Home
              </Link>
              <Link href="/dictionary" className="text-teal-600 font-medium">
                Dictionary
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-teal-600 font-medium">
                About
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/auth?type=login">
                <Button variant="ghost" className="text-gray-600 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth?type=register">
                <Button className="bg-teal-600 text-white hover:bg-teal-700 font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Persian → Bangla Dictionary
          </h1>
          <p className="text-gray-600">Persian to Bengali and English Dictionary</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search in Persian, Bangla, or English..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-10 h-12 rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 shadow-sm"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {isSuggestionsFetching && searchTerm && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500 px-1">
              {isSuggestionsLoading
                ? "Searching..."
                : debouncedSearchTerm &&
                  `${suggestions.length} result${suggestions.length !== 1 ? "s" : ""} found`}
            </div>

            <ScrollArea className="h-[600px] rounded-lg border bg-white">
              <div className="p-2">
                {isSuggestionsLoading ? (
                  <div className="flex items-center justify-center h-full py-20">
                    <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-2">
                    {suggestions.map((word) => (
                      <button
                        key={word.id}
                        onClick={() => handleWordSelect(word.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedWordId === word.id
                            ? "bg-teal-50 border border-teal-200 shadow-sm"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{word.word || word.persianWord}</div>
                        {(word.pronunciation || word.transliteration) && (word.pronunciation !== "-" || word.transliteration !== "-") && (
                          <div className="text-xs text-gray-500 italic mt-1">
                            {word.pronunciation || word.transliteration}
                          </div>
                        )}
                        {word.definition && word.definition !== "-" && (
                          <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {word.definition}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : debouncedSearchTerm ? (
                  <div className="flex flex-col items-center justify-center h-full py-20">
                    <Search className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No words found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try different search terms
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20">
                    <Book className="h-16 w-16 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Start searching</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Type Persian, Bangla, or English words
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="lg:col-span-7">
            {isWordDetailsLoading ? (
              <Card className="rounded-lg border-gray-200 shadow-sm">
                <CardContent className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
                </CardContent>
              </Card>
            ) : selectedWord ? (
              <Card className="rounded-lg border-gray-200 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedWord.word || selectedWord.persianWord}
                    </h2>
                    {(selectedWord.pronunciation || selectedWord.transliteration) &&
                      (selectedWord.pronunciation !== "-" || selectedWord.transliteration !== "-") && (
                        <p className="text-lg text-gray-500 italic">
                          {selectedWord.pronunciation || selectedWord.transliteration}
                        </p>
                      )}
                  </div>

                  {(selectedWord.meaning || selectedWord.banglaMeaning) && (selectedWord.meaning !== "-" || selectedWord.banglaMeaning !== "-") && (
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                      <h3 className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">
                        Meaning
                      </h3>
                      <p className="text-lg text-teal-800 font-medium">
                        {selectedWord.meaning || selectedWord.banglaMeaning}
                      </p>
                    </div>
                  )}

                  {selectedWord.definition && selectedWord.definition !== "-" && (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Definition
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedWord.definition}
                        </p>
                      </div>
                    )}

                  {selectedWord.root && selectedWord.root !== "-" && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Root
                      </h3>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        {selectedWord.root}
                      </div>
                    </div>
                  )}

                  {selectedWord.examples &&
                    selectedWord.examples.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Usage Examples
                        </h3>
                        <div className="space-y-3">
                          {selectedWord.examples.map((example, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                            >
                              <p className="text-sm text-gray-700" dir="auto">
                                {example}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedWord.verses && selectedWord.verses.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Quranic References
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedWord.verses.map((verse, index) => (
                          <div
                            key={index}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                          >
                            {verse}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedWordId(null)}
                    >
                      Back to Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-lg border-gray-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <Book className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Select a word
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Click on any word from the search results to view its
                    details and translations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Copyright © 2023 Almunji. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
