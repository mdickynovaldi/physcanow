"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Data dummy untuk contoh
const dummySoal = [
  {
    id: "1",
    content: "Apa rumus kecepatan?",
    options: ["v = s/t", "v = t/s", "v = s*t", "v = s+t"],
    answer: "v = s/t",
    quizId: "1",
    quizTitle: "Quiz Fisika Dasar",
  },
  {
    id: "2",
    content: "Apa satuan dari gaya?",
    options: ["Watt", "Joule", "Newton", "Pascal"],
    answer: "Newton",
    quizId: "1",
    quizTitle: "Quiz Fisika Dasar",
  },
  {
    id: "3",
    content: "Berapa nilai π (pi) yang sering digunakan?",
    options: ["3.14", "2.71", "1.62", "1.41"],
    answer: "3.14",
    quizId: "2",
    quizTitle: "Quiz Matematika Lanjut",
  },
];

// Data dummy quiz
const dummyQuiz = [
  { id: "1", title: "Quiz Fisika Dasar" },
  { id: "2", title: "Quiz Matematika Lanjut" },
  { id: "3", title: "Quiz Kimia Organik" },
];

export function KelolaSoal() {
  const [soal, setSoal] = useState(dummySoal);
  const [quiz, setQuiz] = useState(dummyQuiz);
  const [activeTab, setActiveTab] = useState("soal");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSoalId, setSelectedSoalId] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");

  // State untuk form soal
  const [soalForm, setSoalForm] = useState({
    id: "",
    content: "",
    options: ["", "", "", ""],
    answer: "",
    quizId: "",
  });

  // State untuk form quiz
  const [quizForm, setQuizForm] = useState({
    id: "",
    title: "",
  });

  const [isEditingSoal, setIsEditingSoal] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);

  // Handler untuk form soal
  const handleSoalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSoalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...soalForm.options];
    newOptions[index] = value;
    setSoalForm((prev) => ({ ...prev, options: newOptions }));
  };

  const handleQuizSelectChange = (value: string) => {
    setSoalForm((prev) => ({ ...prev, quizId: value }));
  };

  const handleAnswerSelectChange = (value: string) => {
    setSoalForm((prev) => ({ ...prev, answer: value }));
  };

  // Handler untuk form quiz
  const handleQuizInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuizForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form soal
  const resetSoalForm = () => {
    setSoalForm({
      id: "",
      content: "",
      options: ["", "", "", ""],
      answer: "",
      quizId: "",
    });
    setIsEditingSoal(false);
  };

  // Reset form quiz
  const resetQuizForm = () => {
    setQuizForm({
      id: "",
      title: "",
    });
    setIsEditingQuiz(false);
  };

  // Submit form soal
  const handleSoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditingSoal) {
      // Update soal yang sudah ada
      setSoal(
        soal.map((s) => {
          if (s.id === soalForm.id) {
            const quizData = quiz.find((q) => q.id === soalForm.quizId);
            return {
              ...soalForm,
              quizTitle: quizData ? quizData.title : "",
            };
          }
          return s;
        })
      );
    } else {
      // Tambah soal baru
      const quizData = quiz.find((q) => q.id === soalForm.quizId);
      const newSoal = {
        ...soalForm,
        id: Date.now().toString(),
        quizTitle: quizData ? quizData.title : "",
      };
      setSoal([...soal, newSoal]);
    }

    resetSoalForm();
  };

  // Submit form quiz
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditingQuiz) {
      // Update quiz yang sudah ada
      setQuiz(quiz.map((q) => (q.id === quizForm.id ? { ...quizForm } : q)));

      // Update quizTitle di soal yang terkait
      setSoal(
        soal.map((s) => {
          if (s.quizId === quizForm.id) {
            return { ...s, quizTitle: quizForm.title };
          }
          return s;
        })
      );
    } else {
      // Tambah quiz baru
      const newQuiz = {
        ...quizForm,
        id: Date.now().toString(),
      };
      setQuiz([...quiz, newQuiz]);
    }

    resetQuizForm();
  };

  // Edit soal
  const handleEditSoal = (id: string) => {
    const soalToEdit = soal.find((s) => s.id === id);
    if (soalToEdit) {
      setSoalForm({
        id: soalToEdit.id,
        content: soalToEdit.content,
        options: [...soalToEdit.options],
        answer: soalToEdit.answer,
        quizId: soalToEdit.quizId,
      });
      setIsEditingSoal(true);
    }
  };

  // Edit quiz
  const handleEditQuiz = (id: string) => {
    const quizToEdit = quiz.find((q) => q.id === id);
    if (quizToEdit) {
      setQuizForm({
        id: quizToEdit.id,
        title: quizToEdit.title,
      });
      setIsEditingQuiz(true);
    }
  };

  // Hapus soal
  const handleDeleteSoal = (id: string) => {
    setSoal(soal.filter((s) => s.id !== id));
    setOpenDialog(false);
  };

  // Hapus quiz
  const handleDeleteQuiz = (id: string) => {
    setQuiz(quiz.filter((q) => q.id !== id));
    // Hapus juga soal yang terkait dengan quiz tersebut
    setSoal(soal.filter((s) => s.quizId !== id));
    setOpenDialog(false);
  };

  // Cek apakah opsi valid untuk SelectItem
  const isValidOption = (option: string) => {
    return option && option.trim() !== "";
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="soal">Kelola Soal</TabsTrigger>
        <TabsTrigger value="quiz">Kelola Quiz</TabsTrigger>
      </TabsList>

      <TabsContent value="soal" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditingSoal ? "Edit Soal" : "Tambah Soal Baru"}
            </CardTitle>
            <CardDescription>
              {isEditingSoal
                ? "Perbarui soal yang sudah ada"
                : "Isi formulir untuk menambahkan soal baru"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSoalSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quizId">Quiz</Label>
                <Select
                  value={soalForm.quizId}
                  onValueChange={handleQuizSelectChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih quiz" />
                  </SelectTrigger>
                  <SelectContent>
                    {quiz.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Pertanyaan</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={soalForm.content}
                  onChange={handleSoalInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Pilihan Jawaban</Label>
                {soalForm.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-medium w-6">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Jawaban Benar</Label>
                <Select
                  value={soalForm.answer}
                  onValueChange={handleAnswerSelectChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jawaban benar" />
                  </SelectTrigger>
                  <SelectContent>
                    {soalForm.options.map(
                      (option, index) =>
                        isValidOption(option) && (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={resetSoalForm}>
                {isEditingSoal ? "Batal" : "Reset"}
              </Button>
              <Button type="submit">
                {isEditingSoal ? "Perbarui" : "Tambah"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Soal</CardTitle>
            <CardDescription>
              Kelola semua soal yang telah dibuat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Pertanyaan</TableHead>
                    <TableHead>Jawaban Benar</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {soal.length > 0 ? (
                    soal.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.quizTitle}</TableCell>
                        <TableCell className="font-medium">
                          {s.content.length > 50
                            ? s.content.substring(0, 50) + "..."
                            : s.content}
                        </TableCell>
                        <TableCell>{s.answer}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSoal(s.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedSoalId(s.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Konfirmasi Hapus</DialogTitle>
                                  <DialogDescription>
                                    Apakah Anda yakin ingin menghapus soal ini?
                                    Tindakan ini tidak dapat dibatalkan.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setOpenDialog(false)}
                                  >
                                    Batal
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteSoal(selectedSoalId)
                                    }
                                  >
                                    Hapus
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        Belum ada soal yang ditambahkan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="quiz" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditingQuiz ? "Edit Quiz" : "Tambah Quiz Baru"}
            </CardTitle>
            <CardDescription>
              {isEditingQuiz
                ? "Perbarui quiz yang sudah ada"
                : "Isi formulir untuk menambahkan quiz baru"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleQuizSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Quiz</Label>
                <Input
                  id="title"
                  name="title"
                  value={quizForm.title}
                  onChange={handleQuizInputChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={resetQuizForm}>
                {isEditingQuiz ? "Batal" : "Reset"}
              </Button>
              <Button type="submit">
                {isEditingQuiz ? "Perbarui" : "Tambah"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Quiz</CardTitle>
            <CardDescription>
              Kelola semua quiz yang telah dibuat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Quiz</TableHead>
                    <TableHead>Jumlah Soal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quiz.length > 0 ? (
                    quiz.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell className="font-medium">{q.title}</TableCell>
                        <TableCell>
                          {soal.filter((s) => s.quizId === q.id).length}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditQuiz(q.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedQuizId(q.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Konfirmasi Hapus</DialogTitle>
                                  <DialogDescription>
                                    Apakah Anda yakin ingin menghapus quiz ini?
                                    Semua soal yang terkait juga akan dihapus.
                                    Tindakan ini tidak dapat dibatalkan.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setOpenDialog(false)}
                                  >
                                    Batal
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteQuiz(selectedQuizId)
                                    }
                                  >
                                    Hapus
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6">
                        Belum ada quiz yang ditambahkan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default KelolaSoal;
