"use client";
import { useEffect, useMemo, useState } from "react";
import { collection, addDoc, onSnapshot, query, where, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

type Subject = { id: string; name: string; createdAt?: any };
type Note = { id: string; topic: string; content: string; createdAt?: any };

export default function SubjectsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, Note[]>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, { topic: string; content: string }>>({});

  const subjectsCol = useMemo(() => (user ? collection(db, "subjects") : null), [user]);

  useEffect(() => {
    if (!user || !subjectsCol) return;
    const q = query(subjectsCol, where("uid", "==", user.uid), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: Subject[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setSubjects(list);
    });
    return () => unsub();
  }, [user, subjectsCol]);

  // Subscribe to notes subcollections when a subject is expanded
  useEffect(() => {
    const unsubs: (() => void)[] = [];
    if (!user) return;
    for (const s of subjects) {
      if (!expanded[s.id]) continue;
      const notesCol = collection(db, "subjects", s.id, "notes");
      const qn = query(notesCol, orderBy("createdAt", "asc"));
      const unsub = onSnapshot(qn, (snap) => {
        const list: Note[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setNotes((prev) => ({ ...prev, [s.id]: list }));
      });
      unsubs.push(unsub);
    }
    return () => {
      unsubs.forEach((u) => u());
    };
  }, [subjects, expanded, user]);

  async function addSubject() {
    if (!user || !newSubject.trim() || !subjectsCol) return;
    await addDoc(subjectsCol, {
      uid: user.uid,
      name: newSubject.trim(),
      createdAt: serverTimestamp(),
    });
    setNewSubject("");
  }

  async function addNote(subjectId: string) {
    const draft = noteDrafts[subjectId] || { topic: "", content: "" };
    if (!draft.topic.trim() || !draft.content.trim()) return;
    const notesCol = collection(db, "subjects", subjectId, "notes");
    await addDoc(notesCol, {
      topic: draft.topic.trim(),
      content: draft.content.trim(),
      createdAt: serverTimestamp(),
    });
    setNoteDrafts((prev) => ({ ...prev, [subjectId]: { topic: "", content: "" } }));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Subjects</h1>
      <p className="text-zinc-600">Add subjects and create topic-wise notes for each subject.</p>

      <div className="flex gap-2">
        <input
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Subject name"
          className="w-full rounded-md border border-zinc-300 bg-white p-2 outline-none"
        />
        <button onClick={addSubject} className="rounded-md bg-zinc-900 px-4 py-2 text-white">
          Add
        </button>
      </div>

      <div className="space-y-4">
        {subjects.length === 0 && (
          <div className="text-sm text-zinc-500">No subjects yet. Create your first subject above.</div>
        )}

        {subjects.map((s) => {
          const isOpen = !!expanded[s.id];
          const draft = noteDrafts[s.id] || { topic: "", content: "" };
          const list = notes[s.id] || [];
          return (
            <div key={s.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">{s.name}</div>
                <button
                  className="text-sm underline"
                  onClick={() => setExpanded((prev) => ({ ...prev, [s.id]: !isOpen }))}
                >
                  {isOpen ? "Hide Notes" : "Show Notes"}
                </button>
              </div>

              {isOpen && (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-2">
                    <input
                      value={draft.topic}
                      onChange={(e) => setNoteDrafts((p) => ({ ...p, [s.id]: { ...draft, topic: e.target.value } }))}
                      placeholder="Topic"
                      className="rounded-md border border-zinc-300 bg-white p-2 outline-none"
                    />
                    <textarea
                      value={draft.content}
                      onChange={(e) => setNoteDrafts((p) => ({ ...p, [s.id]: { ...draft, content: e.target.value } }))}
                      placeholder="Write your note content..."
                      rows={4}
                      className="rounded-md border border-zinc-300 bg-white p-2 outline-none"
                    />
                    <div>
                      <button onClick={() => addNote(s.id)} className="rounded-md bg-zinc-900 px-4 py-2 text-white">
                        Add Note
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {list.length === 0 ? (
                      <div className="text-sm text-zinc-500">No notes for this subject yet.</div>
                    ) : (
                      list.map((n) => (
                        <div key={n.id} className="rounded-lg border border-zinc-200 bg-white p-3">
                          <div className="text-sm font-medium">{n.topic}</div>
                          <div className="text-sm text-zinc-600 whitespace-pre-wrap">{n.content}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
