"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetDictionarySuggestionsQuery,
  useGetDictionaryWordQuery,
} from "@/redux/api/dictionaryApi";
import { TWordDetails, TWordSuggestion } from "@/types/dictionary";
import { Book, Loader2, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function PersianBanglaDictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch suggestions based on debounced search term
  const {
    data: suggestionsData,
    isLoading: isSuggestionsLoading,
    isFetching: isSuggestionsFetching,
  } = useGetDictionarySuggestionsQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm, // Skip query if search term is empty
  });

  // Fetch selected word details by ID
  const { data: wordDetailsData, isLoading: isWordDetailsLoading } =
    useGetDictionaryWordQuery(selectedWordId || "", {
      skip: !selectedWordId,
    });

  const suggestions = (suggestionsData?.data as TWordSuggestion[]) || [];
  const selectedWord = (wordDetailsData?.data as TWordDetails) || null;

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Minimalistic Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Book className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Persian → Bangla Dictionary
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-9">
            ফার্সি থেকে বাংলা এবং ইংরেজি অভিধান
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Search + Results */}
          <div className="space-y-4">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search in Persian, Bangla, or English..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
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
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                </div>
              )}
            </div>

            {/* Results Count */}
            {debouncedSearchTerm && (
              <div className="text-xs text-gray-500 px-1">
                {isSuggestionsLoading
                  ? "Searching..."
                  : `${suggestions.length} result${
                      suggestions.length !== 1 ? "s" : ""
                    } found`}
              </div>
            )}

            {/* Suggestions List */}
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-2 pr-4">
                {isSuggestionsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((word: TWordSuggestion) => (
                    <button
                      key={word.id}
                      onClick={() => handleWordSelect(word.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedWordId === word.id
                          ? "border-emerald-500 bg-emerald-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        {word.word}
                      </div>
                      {word.pronunciation && word.pronunciation !== "-" && (
                        <div className="text-sm text-gray-500 mb-1 italic">
                          {word.pronunciation}
                        </div>
                      )}
                      {word.definition && word.definition !== "-" && (
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {word.definition}
                        </div>
                      )}
                    </button>
                  ))
                ) : debouncedSearchTerm ? (
                  <div className="text-center py-20">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No words found</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Try different search terms
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Start searching</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Type Persian, Bangla, or English words
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Column: Word Details */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            {isWordDetailsLoading ? (
              <Card className="border-gray-200">
                <CardContent className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                </CardContent>
              </Card>
            ) : selectedWord ? (
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  {/* Word Title */}
                  <div className="border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedWord.word}
                    </h2>
                    {selectedWord.pronunciation &&
                      selectedWord.pronunciation !== "-" && (
                        <p className="text-gray-500 italic">
                          {selectedWord.pronunciation}
                        </p>
                      )}
                  </div>

                  {/* Definition */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Definition
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedWord.definition !== "-"
                        ? selectedWord.definition
                        : "No definition available"}
                    </p>
                  </div>

                  {/* Meaning */}
                  {selectedWord.meaning && selectedWord.meaning !== "-" && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Meaning
                      </h3>
                      <p className="text-emerald-700 font-medium">
                        {selectedWord.meaning}
                      </p>
                    </div>
                  )}

                  {/* Root */}
                  {selectedWord.root && selectedWord.root !== "-" && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Root
                      </h3>
                      <Badge
                        variant="outline"
                        className="border-emerald-200 text-emerald-700"
                      >
                        {selectedWord.root}
                      </Badge>
                    </div>
                  )}

                  {/* Examples */}
                  {selectedWord.examples &&
                    selectedWord.examples.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Usage Examples
                        </h3>
                        <div className="space-y-2">
                          {selectedWord.examples.map(
                            (example: string, index: number) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-3 rounded border border-gray-200"
                              >
                                <p className="text-sm text-gray-700" dir="auto">
                                  {example}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Quranic References */}
                  {selectedWord.verses && selectedWord.verses.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Quranic References
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedWord.verses.map(
                          (verse: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            >
                              {verse}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-200">
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
    </div>
  );
}
