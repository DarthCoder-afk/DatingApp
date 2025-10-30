"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/src/components/NavBar";

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
    <div className="min-h-screen bg-base-200 bg-gradient-to-br from-rose-50 to-pink-300">
      <Navbar/>
      {/* Left Column */}
      <div className="flex flex-col md:flex-row justify-center p-8">
        <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/3 flex flex-col items-center">
        <div className="avatar mb-4">
          <div className="w-40 rounded-full ring ring-rose-500 ring-offset-base-100 ring-offset-2">
            <Image
              src={preview || profile.photoUrl || "/default/default_profile.svg"}
              alt="Profile"
              width={160}
              height={160}
              className="rounded-full"
            />
          </div>
        </div>

        <h2 className="text-lg font-bold text-center">
          {profile.name.toUpperCase()}, {profile.age}
        </h2>
        <p className="text-gray-500 mt-1">
          {profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : ""}
        </p>

        <div className="divider"></div>

        <label className="font-medium mb-1">Update Photo</label>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered file-input-rose-600 w-full mb-4"
          onChange={handlePhotoChange}
        />

        <Link href="/home" className="btn btn-outline w-full mt-auto">
          Go back
        </Link>
      </div>

      {/* Right Column */}
      <div className="bg-white rounded-lg shadow-md p-8 w-full md:w-2/3 md:ml-6 mt-6 md:mt-0">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="form-control">
            <label className="label font-medium">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Bio */}
          <div className="form-control">
            <label className="label font-medium">Description</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Write a short description about yourself..."
            ></textarea>
          </div>

          {/* Gender + Age */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control flex-1">
              <label className="label font-medium">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
                className="select select-bordered w-full"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>

            <div className="form-control flex-1">
              <label className="label font-medium">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: parseInt(e.target.value) })
                }
                className="input input-bordered w-full"
                min={18}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-rose-600 w-full text-white bg-rose-600 hover:bg-rose-700 mt-4 `}
          >Update Profile
           
          </button>
        </form>
      </div>

      </div>
      
    </div>
  );
}
