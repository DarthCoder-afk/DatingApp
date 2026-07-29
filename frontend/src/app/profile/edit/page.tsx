"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Navbar from "@/src/components/NavBar";
import { Camera, CheckCircle2, LogOut, Save, UserRound } from "lucide-react";
import MobileBottomNav from "@/src/components/MobileBottomNav";
import AppSkeleton from "@/src/components/AppSkeleton";

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
  const [profileLoading, setProfileLoading] = useState(true);

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
        if (!res.ok) throw new Error(data.message);
        setProfile(data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setProfileLoading(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (profileLoading) {
    return (
      <div className="app-shell">
        <div className="hidden md:block"><Navbar /></div>
        <main className="app-page">
          <header className="app-page-header">
            <div><p className="eyebrow">Profile</p><h1>Make it feel like you.</h1><p className="subtle">Your details help the right people recognize you.</p></div>
            <span className="app-page-mark"><UserRound size={20} /></span>
          </header>
          <AppSkeleton variant="profile" />
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="hidden md:block"><Navbar/></div>
      <main className="app-page">
        <header className="app-page-header">
          <div><p className="eyebrow">Profile</p><h1>Make it feel like you.</h1><p className="subtle">Keep the details honest, current, and unmistakably yours.</p></div>
          <span className="app-page-mark"><UserRound size={20} /></span>
        </header>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="app-panel h-fit p-6">
            <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-3xl bg-[#f7dfd2] ring-4 ring-[#f2d5c8] ring-offset-4 ring-offset-[#fffdf9]">
              {useNextImage ? <Image src={avatarUrl} alt="Profile" fill sizes="176px" className="object-cover" /> : <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              </>}
            </div>
            <div className="mt-6 text-center"><h2 className="font-serif text-2xl font-semibold text-[#33252b]">{profile.name || "Your profile"}{profile.age ? `, ${profile.age}` : ""}</h2><p className="mt-1 text-sm capitalize text-[#88777c]">{profile.gender || "Add your details"}</p></div>
            <div className="my-6 h-px bg-[#eee4df]" />
            <label htmlFor="profile-photo" className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#f3e6e1] px-4 py-3 text-sm font-semibold text-[#9f514c] transition hover:bg-[#eddad3]"><Camera size={17} /> Change photo</label>
            <input id="profile-photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <p className="mt-3 text-center text-xs leading-5 text-gray-500">Choose a clear photo that shows your face. JPG, PNG, or WEBP work best.</p>
            {photo && <p className="mt-4 truncate rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-medium text-emerald-700"><CheckCircle2 className="mr-1 inline" size={14} /> {photo.name}</p>}
            <div className="my-6 h-px bg-[#eee4df]" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfcfc8] bg-transparent px-4 py-3 text-sm font-semibold text-[#8f4f4c] transition hover:border-[#cfa99e] hover:bg-[#f8efeb]"
            >
              <LogOut size={17} /> Log out
            </button>
          </aside>

          <section className="app-panel p-6 md:p-8">
            <div className="mb-7 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7dfd2] text-[#c65743]"><UserRound size={20} /></div><div><h2 className="font-bold text-[#2d2023]">About you</h2><p className="text-sm text-[#827074]">These details appear on your profile.</p></div></div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="profile-name" className="app-label">Name</label>
            <input
              id="profile-name"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="app-input"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-bio" className="app-label">Bio <span className="font-normal text-[#a19095]">(optional)</span></label>
            <textarea
              id="profile-bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="app-input resize-none"
              rows={5}
              placeholder="Write a short description about yourself..."
            ></textarea>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-gender" className="app-label">Gender</label>
              <select
                id="profile-gender"
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
                className="app-input"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>

            <div>
              <label htmlFor="profile-age" className="app-label">Age</label>
              <input
                id="profile-age"
                type="number"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: parseInt(e.target.value) })
                }
                className="app-input"
                min={18}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4a2e3a] px-4 py-3 font-semibold text-white shadow-lg shadow-[#d8c7c0] transition hover:bg-[#38212b] disabled:cursor-not-allowed disabled:opacity-70"
          >{loading ? "Saving changes..." : <><Save size={18} /> Save changes</>}
           
          </button>
        </form>
          </section>
        </div>
      </main><MobileBottomNav />
      
    </div>
  );
}
