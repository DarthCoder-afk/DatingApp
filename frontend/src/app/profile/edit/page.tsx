"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/src/components/NavBar";
import { ArrowLeft, Camera, CheckCircle2, Save, UserRound } from "lucide-react";
import MobileBottomNav from "@/src/components/MobileBottomNav";

interface Profile {
  name: string;
  age: number;
  bio: string;
  gender: string;
  photoUrl?: string | null;
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    age: 18,
    bio: "",
    gender: "",
    photoUrl: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const dicebearUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(profile.name || "HeartLink member")}&backgroundColor=ffe4e6`;
  const avatarUrl = preview || profile.photoUrl || dicebearUrl;
  const useNextImage = Boolean(!preview && profile.photoUrl && !profile.photoUrl.startsWith("https://api.dicebear.com/"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profiles/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setProfile(data);
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [token]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("age", profile.age.toString());
      formData.append("bio", profile.bio);
      formData.append("gender", profile.gender);
      if (photo) formData.append("photo", photo);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/update`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Profile updated successfully!");
       setTimeout(() =>{
        window.location.href = "/home";
      }, 1500);
    } catch (err) {
      console.log("Error message:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 via-white to-pink-50">
      <div className="hidden md:block"><Navbar/></div>
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-6 md:px-10 md:py-12">
        <header className="mb-6 flex items-center justify-between md:hidden"><Link href="/home" aria-label="Back to discover" className="text-rose-500"><ArrowLeft size={21} /></Link><h1 className="text-xl font-semibold text-slate-900">Edit profile</h1><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><UserRound size={18} /></span></header>
        <div className="mb-8 hidden md:block"><Link href="/home" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-rose-600"><ArrowLeft size={16} /> Back to discover</Link><p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">Profile settings</p><h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">Make your profile feel like you.</h1><p className="mt-3 max-w-2xl text-gray-600">Keep your details current so new connections can get to know the real you.</p></div>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-3xl border border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/60">
            <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-3xl bg-rose-50 ring-4 ring-rose-100 ring-offset-4 ring-offset-white">
              {useNextImage ? <Image src={avatarUrl} alt="Profile" fill sizes="176px" className="object-cover" /> : <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />}
            </div>
            <div className="mt-6 text-center"><h2 className="text-xl font-bold text-gray-900">{profile.name || "Your profile"}{profile.age ? `, ${profile.age}` : ""}</h2><p className="mt-1 text-sm capitalize text-gray-500">{profile.gender || "Add your details"}</p></div>
            <div className="my-6 h-px bg-rose-100" />
            <label htmlFor="profile-photo" className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"><Camera size={17} /> Change photo</label>
            <input id="profile-photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <p className="mt-3 text-center text-xs leading-5 text-gray-500">Choose a clear photo that shows your face. JPG, PNG, or WEBP work best.</p>
            {photo && <p className="mt-4 truncate rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-medium text-emerald-700"><CheckCircle2 className="mr-1 inline" size={14} /> {photo.name}</p>}
          </aside>

          <section className="rounded-3xl border border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/60 md:p-8">
            <div className="mb-7 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><UserRound size={20} /></div><div><h2 className="font-bold text-gray-900">About you</h2><p className="text-sm text-gray-500">These details appear on your profile.</p></div></div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-gray-700">Name</label>
            <input
              id="profile-name"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-bio" className="mb-2 block text-sm font-semibold text-gray-700">Bio <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea
              id="profile-bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
              rows={5}
              placeholder="Write a short description about yourself..."
            ></textarea>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-gender" className="mb-2 block text-sm font-semibold text-gray-700">Gender</label>
              <select
                id="profile-gender"
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>

            <div>
              <label htmlFor="profile-age" className="mb-2 block text-sm font-semibold text-gray-700">Age</label>
              <input
                id="profile-age"
                type="number"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: parseInt(e.target.value) })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
                min={18}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
          >{loading ? "Saving changes..." : <><Save size={18} /> Save changes</>}
           
          </button>
        </form>
          </section>
        </div>
      </main><MobileBottomNav />
      
    </div>
  );
}
