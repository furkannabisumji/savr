import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button"; // Assuming Button is your Shadcn button component

export function Terms() {
  const { slug } = useParams();
  const [terms, setTerms] = useState(""); // State to store terms content
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [formVisible, setFormVisible] = useState(false); // State to toggle between form and fetched terms
  const [saving, setSaving] = useState(false); // State to manage saving process
  const [error, setError] = useState(""); // State to manage error messages

  // Fetch terms from Supabase
  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("terms") // Access the "terms" table
        .select("content") // Assuming "content" is the column that holds the terms text
        .eq("group_id", slug) // Match the group_id
        .single(); // Fetch single record

      if (error) {
        console.error("Error fetching terms:", error);
        setFormVisible(true); // Show form if there's an error
        setLoading(false);
      } else if (data) {
        setTerms(data.content); // Set fetched terms content if available
        setFormVisible(false); // Hide form if terms are fetched
        setLoading(false);
      } else {
        console.log("No terms found");
        setFormVisible(true); // Show form if no terms are found
        setLoading(false);
      }
    };

    fetchTerms();
  }, [slug]); // Refetch when groupId changes

  const handleEditorChange = (content: string) => {
    setTerms(content); // Update terms state when the editor content changes
  };

  const handleSaveTerms = async () => {
    // Check if terms content is empty
    if (!terms.trim()) {
      setError("Terms cannot be empty.");
      return; // Prevent save if terms are empty
    }

    setError(""); // Clear error message if terms are valid
    setSaving(true); // Set saving to true when the save process starts

    const { data, error } = await supabase
      .from("terms")
      .upsert([{ group_id: slug, content: terms }]); // Upsert new or update existing terms

    if (error) {
      console.error("Error saving terms:", error);
    } else {
      console.log("Terms saved successfully");
      setFormVisible(false); // Hide form after saving
    }
    setSaving(false); // Set saving to false after the process completes
  };

  return (
    <div className="flex h-full overflow-y-auto leading-relaxed">
      {loading ? (
        <p>Loading...</p>
      ) : formVisible ? (
        <div className="w-full">
          <Editor
            apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY as string}
            initialValue={terms || ""}
            init={{
              height: 450,
              menubar: false,
              plugins: ["link", "image", "lists"],
              toolbar:
                "undo redo | formatselect | bold italic | link image | alignleft aligncenter alignright",
            }}
            onEditorChange={handleEditorChange}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
          {/* Show error message if terms are empty */}
          <div className="w-full flex justify-end">
            <Button
              className="mt-4 px-4 py-2 text-white"
              onClick={handleSaveTerms}
              disabled={saving} // Disable button while saving
            >
              {saving ? (
                <span>Saving...</span> // Display "Saving..." when saving
              ) : (
                "Save Terms"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="terms-preview w-full">
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: terms }}
          />
        </div>
      )}
    </div>
  );
}
