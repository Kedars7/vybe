import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/frontend-assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [privacyMode, setPrivacyMode] = useState("public");
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const navigate = useNavigate();
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  // Available genres
  const availableGenres = [
    "rock", "pop", "jazz", "classical", "hip-hop", 
    "electronic", "country", "reggae", "blues", "metal"
  ];

  // Pre-installed profile pictures
  const preInstalledAvatars = [
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Brian',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Emma',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Michael',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Olivia',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=David',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Sophia',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=James',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Isabella',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=William',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Charlotte',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Benjamin',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Amelia',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Caleb',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Vivian',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Avery',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Chase'
  ];

  const handleNext = (e) => {
    e.preventDefault();
    if (email && password) {
      setStep(2);
    }
  };

  const handleSelectPreInstalledAvatar = (avatarUrl) => {
    setPreviewImage(avatarUrl);
    setProfilePicture(avatarUrl);
    setShowProfilePicker(false);
  };

  const handleGenreToggle = (genre) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter(g => g !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const handleStep2Next = (e) => {
    e.preventDefault();
    if (username) {
      setStep(3);
    }
  };


  const handleSignup =  async (e) => {
    e.preventDefault();
    //Backend signup logic here
    if(!username || !email || !password){
      toast.error("All fields are required");
      return;
    }

    try{
      const response = await axios.post(`${backendurl}/api/user/register`,
        {
          username,
          email,
          password,
          profileImg: profilePicture,
          privacyMode,
          favoriteGenres
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if(response.data.success){
        toast.success("User Registered Successfully");
        //check if token is set in cookies
        navigate("/");
        window.location.reload();
      } else {
        toast.error(response.data.message || "User Registration Failed");
      }
    }
    catch(error){
      const errorMessage = error.response?.data?.message || "User Registration Failed";
      toast.error(errorMessage);
    }

  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={assets.vybe_logo} alt="Vybe" className="h-10" />
        </div>

        {/* Heading */}
        <h1 className="text-white text-center font-bold text-4xl sm:text-5xl mb-8">
          {step === 1 ? (
            <>
              Sign up to
              <br />
              start listening
            </>
          ) : step === 2 ? (
            <>
              Create your
              <br />
              profile
            </>
          ) : (
            <>
              Customize your
              <br />
              experience
            </>
          )}
        </h1>

        {/* Step 1: Email and Password Form */}
        {step === 1 && (
          <form onSubmit={handleNext} className="mb-4">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] text-white border border-gray-600 rounded px-4 py-3 mb-4 focus:outline-none focus:border-white placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121212] text-white border border-gray-600 rounded px-4 py-3 mb-4 focus:outline-none focus:border-white placeholder-gray-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 mb-4"
            >
              Next
            </button>
          </form>
        )}

        {/* Step 2: Username and Profile Picture Form */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="mb-4">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-[#121212] border-2 border-gray-600 flex items-center justify-center">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfilePicker(true)}
                  className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-400 rounded-full p-2 cursor-pointer transition-all"
                >
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 text-sm">Upload profile picture</p>
            </div>

            {/* Profile Picture Picker Modal */}
            {showProfilePicker && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-70 z-40"
                  onClick={() => setShowProfilePicker(false)}
                />
                
                {/* Modal */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="bg-[#282828] rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-white text-xl font-bold">Choose Profile Picture</h2>
                      <button
                        type="button"
                        onClick={() => setShowProfilePicker(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Pre-installed Avatars Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
                      {preInstalledAvatars.map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSelectPreInstalledAvatar(avatar)}
                          className="w-full aspect-square rounded-full overflow-hidden border-2 border-gray-600 hover:border-green-500 transition-all transform hover:scale-105"
                        >
                          <img
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>

                   
                  </div>
                </div>
              </>
            )}

            {/* Username Input */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 text-sm">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#121212] text-white border border-gray-600 rounded px-4 py-3 focus:outline-none focus:border-white placeholder-gray-400"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-transparent border border-gray-500 hover:border-white text-white font-semibold py-3 px-6 rounded-full transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Privacy Mode and Favorite Genres */}
        {step === 3 && (
          <form onSubmit={handleSignup} className="mb-4">
            {/* Privacy Mode Selection */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3 text-sm">
                Privacy Mode
              </label>
              <div className="space-y-3">
                <div
                  onClick={() => setPrivacyMode("public")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    privacyMode === "public"
                      ? "border-green-500 bg-green-500 bg-opacity-10"
                      : "border-gray-600 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Public</h3>
                      <p className="text-gray-400 text-sm">Everyone can see your activity</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      privacyMode === "public" ? "border-green-500 bg-green-500" : "border-gray-400"
                    }`}>
                      {privacyMode === "public" && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPrivacyMode("vibe-only")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    privacyMode === "vibe-only"
                      ? "border-green-500 bg-green-500 bg-opacity-10"
                      : "border-gray-600 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Vibe Only</h3>
                      <p className="text-gray-400 text-sm">Only friends can see your activity</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      privacyMode === "vibe-only" ? "border-green-500 bg-green-500" : "border-gray-400"
                    }`}>
                      {privacyMode === "vibe-only" && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPrivacyMode("invisible")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    privacyMode === "invisible"
                      ? "border-green-500 bg-green-500 bg-opacity-10"
                      : "border-gray-600 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Invisible</h3>
                      <p className="text-gray-400 text-sm">Keep your activity private</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      privacyMode === "invisible" ? "border-green-500 bg-green-500" : "border-gray-400"
                    }`}>
                      {privacyMode === "invisible" && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite Genres Selection */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3 text-sm">
                Favorite Genres (Optional)
              </label>
              <p className="text-gray-400 text-xs mb-3">Select your favorite music genres</p>
              <div className="grid grid-cols-2 gap-2">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                      favoriteGenres.includes(genre)
                        ? "bg-green-500 text-black"
                        : "bg-[#121212] text-white border border-gray-600 hover:border-white"
                    }`}
                  >
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 bg-transparent border border-gray-500 hover:border-white text-white font-semibold py-3 px-6 rounded-full transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* Divider*/}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

        {/* Login Link */}
        <div className="text-center text-gray-400 mb-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white underline hover:text-green-500"
          >
            Log in
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 leading-relaxed">
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="#" className="underline hover:text-green-500">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-green-500">
            Terms of Service
          </a>{" "}
          apply.
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
