import { useState } from "react";
import { Upload, Users, Camera, X, Image, LoaderIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "../lib/api";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const AddGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groupPic, setGroupPic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { mutate: groupCreationMutation, isPending } = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      toast.success("Group created successfully");
      navigate(`/group/${data._id}`);
      queryClient.invalidateQueries(["groups"]);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupPic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setGroupPic(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    groupCreationMutation({
      name: groupName,
      photo: groupPic,
    });
    // Add your submit logic here
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-4 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Group
          </h1>
          <p className="text-gray-600 text-lg">
            Start splitting expenses with your friends
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
          <div className="space-y-8">
            {/* Group Picture Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Group Picture
              </label>

              <div className="flex flex-col items-center">
                {/* Preview or Upload Area */}
                {previewUrl ? (
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-100">
                      <img
                        src={previewUrl}
                        alt="Group preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Change Photo Button */}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="text-center text-white">
                        <Camera className="w-8 h-8 mx-auto mb-1" />
                        <span className="text-sm font-medium">Change</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="w-full max-w-md cursor-pointer">
                    <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-200 group">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 group-hover:bg-emerald-200 transition-colors">
                        <Image className="w-8 h-8 text-emerald-600" />
                      </div>

                      <p className="text-gray-700 font-semibold mb-2">
                        Upload Group Picture
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Click to browse or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Group Name Input */}
            <div>
              <label
                htmlFor="groupName"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Group Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., NYC Trip, Roommates, Office Lunch"
                  className="input input-bordered w-full pl-12 pr-4 py-6 text-lg rounded-xl border-2 border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Choose a memorable name for your group
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!groupName.trim() || isPending}
                className="flex-1 btn btn-lg bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Create Group{" "}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setGroupName("");
                  setGroupPic(null);
                  setPreviewUrl(null);
                }}
                className="btn btn-lg btn-outline border-2 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <svg
                  className="w-5 h-5 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  After creating the group, you'll be able to add members and
                  start tracking expenses together.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGroup;
