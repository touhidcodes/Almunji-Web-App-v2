"use client";

import React, { useState, useEffect } from "react";
import { Search, Book, ChevronRight, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetDictionarySuggestionsQuery,
  useGetDictionaryWordQuery,
} from "@/redux/api/dictionaryApi";

export default function QuranPersianDictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  console.log(debouncedSearchTerm);
  // Fetch suggestions based on search term
  const {
    data: suggestionsData,
    isLoading: isSuggestionsLoading,
    isFetching: isSuggestionsFetching,
  } = useGetDictionarySuggestionsQuery(debouncedSearchTerm);

  console.log(suggestionsData);
  // Fetch selected word details by ID
  const { data: wordDetailsData, isLoading: isWordDetailsLoading } =
    useGetDictionaryWordQuery(
      selectedWordId || "",
      { skip: !selectedWordId } // Skip query if no word is selected
    );

  const suggestions = suggestionsData?.data || [];
  const selectedWord = wordDetailsData?.data || null;

  const handleWordSelect = (wordId: string) => {
    setSelectedWordId(wordId);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedWordId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset selected word when search term changes
    if (selectedWordId) {
      setSelectedWordId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Book className="h-8 w-8 text-emerald-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              فرهنگ فارسی قرآن
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Persian Dictionary of Quranic Terms
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {/* Search Section */}
          <div className="lg:w-1/3">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Dictionary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search Persian, Arabic, or English..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-10"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {isSuggestionsFetching && (
                    <div className="absolute right-10 top-3">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    </div>
                  )}
                </div>

                {/* Clear Search */}
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={clearSearch}
                    className="w-full"
                  >
                    Clear Search
                  </Button>
                )}

                {/* Results Count */}
                {debouncedSearchTerm && (
                  <div className="text-sm text-gray-500 pt-2 border-t">
                    {isSuggestionsLoading ? (
                      "Searching..."
                    ) : (
                      <>
                        {suggestions.length} word
                        {suggestions.length !== 1 ? "s" : ""} found
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Suggestions List */}
          <div className="lg:w-1/3">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {isSuggestionsLoading ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <Loader2 className="h-12 w-12 text-emerald-600 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-500">Loading suggestions...</p>
                    </CardContent>
                  </Card>
                ) : suggestions.length > 0 ? (
                  suggestions.map((word: any) => (
                    <Card
                      key={word.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedWordId === word.id
                          ? "ring-2 ring-emerald-500 bg-emerald-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleWordSelect(word.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="text-lg font-semibold text-gray-800">
                              {word.word}
                            </div>
                            {word.pronunciation &&
                              word.pronunciation !== "-" && (
                                <p className="text-sm text-gray-500 italic">
                                  {word.pronunciation}
                                </p>
                              )}
                            {word.definition && word.definition !== "-" && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {word.definition}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : debouncedSearchTerm ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No words found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search terms
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="text-center py-8">
                    <CardContent>
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Start searching
                      </h3>
                      <p className="text-gray-500">
                        Type in the search box to find words
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Word Details */}
          <div className="lg:w-1/3">
            {isWordDetailsLoading ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Loader2 className="h-16 w-16 text-emerald-600 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-500">Loading word details...</p>
                </CardContent>
              </Card>
            ) : selectedWord ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <div className="space-y-2">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">
                        {selectedWord.word}
                      </h2>
                      {selectedWord.pronunciation &&
                        selectedWord.pronunciation !== "-" && (
                          <p className="text-lg italic text-gray-500">
                            {selectedWord.pronunciation}
                          </p>
                        )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Definition */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Definition
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedWord.definition !== "-"
                        ? selectedWord.definition
                        : "No definition available"}
                    </p>
                  </div>

                  {/* Additional fields if your API returns more data */}
                  {selectedWord.meaning && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Meaning
                      </h3>
                      <p className="text-lg font-medium text-emerald-600">
                        {selectedWord.meaning}
                      </p>
                    </div>
                  )}

                  {selectedWord.root && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Root</h3>
                      <Badge variant="outline" className="text-lg">
                        {selectedWord.root}
                      </Badge>
                    </div>
                  )}

                  {selectedWord.examples &&
                    selectedWord.examples.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Usage Examples
                        </h3>
                        <div className="space-y-2">
                          {selectedWord.examples.map(
                            (example: string, index: number) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-3 rounded-lg"
                              >
                                <p className="text-right font-medium" dir="rtl">
                                  {example}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {selectedWord.verses && selectedWord.verses.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Quranic References
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedWord.verses.map(
                          (verse: string, index: number) => (
                            <Badge key={index} variant="secondary">
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
              <Card className="text-center py-12">
                <CardContent>
                  <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Select a word to view details
                  </h3>
                  <p className="text-gray-500">
                    Click on any word from the search results to see its
                    detailed information and definition.
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
