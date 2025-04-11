
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FileUp, FileX, File, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onFileUpload?: (file: File) => void;
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
  multiple?: boolean;
}

const FileUploader = ({
  onFileUpload,
  maxFileSizeMB = 10,
  allowedFileTypes = ["application/pdf"],
  multiple = false,
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `The file exceeds the maximum size of ${maxFileSizeMB}MB.`,
        variant: "destructive",
      });
      return false;
    }

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Only ${allowedFileTypes.join(", ")} files are allowed.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newFiles: File[] = [];
    let validFiles = true;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (validateFile(file)) {
        newFiles.push(file);
      } else {
        validFiles = false;
        break;
      }
    }
    
    if (!validFiles) return;
    
    if (!multiple && newFiles.length > 1) {
      toast({
        title: "Multiple files detected",
        description: "Please upload only one file.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsUploading(false);
          setUploadedFiles(multiple ? [...uploadedFiles, ...newFiles] : newFiles);
          newFiles.forEach((file) => onFileUpload?.(file));
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[200px] ${
          isDragging
            ? "border-accent bg-accent/10"
            : "border-border hover:border-accent/50 hover:bg-accent/5"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          accept={allowedFileTypes.join(",")}
          multiple={multiple}
        />
        
        <FileUp className="h-10 w-10 text-muted-foreground mb-3" />
        
        <h3 className="text-lg font-medium mb-1">Drag and drop your files here</h3>
        <p className="text-muted-foreground text-sm mb-3">
          or click to browse files
        </p>
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          Accepted file formats: {allowedFileTypes.map(type => type.replace("application/", "")).join(", ")}
          <br />
          Max file size: {maxFileSizeMB}MB
        </p>
      </div>

      {isUploading && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">
            Uploading...
          </p>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <Card key={`${file.name}-${index}`}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <File className="h-5 w-5 mr-2 text-accent" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px] md:max-w-md">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  >
                    <FileX className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
