import React, { useEffect, useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { completeOnboarding } from '../lib/api'
import { CameraIcon, ShuffleIcon } from "lucide-react"
import { LANGUAGES, SKILLS } from '../constants'
import { useNavigate } from 'react-router-dom'

const OnboardingPage = () => {
  const { authenticatedUser } = useAuthUser()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: authenticatedUser?.fullName || '',
    image: authenticatedUser?.image || '',
    skill: authenticatedUser?.skill || '',
    language: authenticatedUser?.language || '',
    location: authenticatedUser?.location || '',
    bio: authenticatedUser?.bio || '',
  })

  useEffect(() => {
    if (authenticatedUser) {
      setFormData(prev => ({
        fullName: prev.fullName || authenticatedUser.fullName || '',
        image: prev.image || authenticatedUser.image || '',
        skill: prev.skill || authenticatedUser.skill || '',
        language: prev.language || authenticatedUser.language || '',
        location: prev.location || authenticatedUser.location || '',
        bio: prev.bio || authenticatedUser.bio || '',
      }))
    }
  }, [authenticatedUser])

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(['authUser'], { user: data.user })
      }
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
      toast.success("Profile completed successfully!")
      navigate('/')
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || "Failed to complete profile. Please try again."
      toast.error(errorMsg)
    }
  })

  const handleOnboarding = (e) => {
    e.preventDefault()
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name")
      return
    }
    if (!formData.location.trim()) {
      toast.error("Please enter your location in Sierra Leone")
      return
    }
    if (!formData.language) {
      toast.error("Please select your primary language")
      return
    }
    if (!formData.skill) {
      toast.error("Please select your mentorship focus area")
      return
    }
    onboardingMutation(formData)
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 1000) + 1; 
    const randomAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${idx}&backgroundColor=ffd5dc&style=circle`
    setFormData({ ...formData, image: randomAvatar })
    toast.success("Avatar updated")
  }

  return (
    <div className='min-h-screen w-full flexCenter py-10 px-4'>
      <div className='card bg-base-100 card-border border-base-300 card-sm max-w-2xl w-full p-3 shadow-lg'>
        <div className='card-body w-full'>
          {/* FORM */}
          <form onSubmit={handleOnboarding}>
            <div className="my-4">
              <div className="flexCenter flex-col gap-3 mb-6 text-center">
                <div>
                  <h2 className='text-2xl font-bold'>Complete Profile</h2>
                  <p className="para mt-1">Please complete your mentorship profile to get started with Mentor 2 Mentored.</p>
                </div>
                {/* Profile Image */}
                {formData.image ? (
                  <img src={formData.image} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-base-200 flexCenter">
                    <CameraIcon className="size-10 text-base-content opacity-40" />
                  </div>
                )}
                <button type='button' onClick={handleRandomAvatar} className='btn btn-info btn-xs gap-1'>
                  <ShuffleIcon className='size-3.5'/> Generate another
                </button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-medium">Full Name</legend>
                  <label className="input validator w-full">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </g>
                    </svg>
                    <input
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      value={formData.fullName}
                      type="text"
                      required
                      placeholder="e.g. Aminata Sesay"
                      minLength="3"
                      maxLength="50"
                    />
                  </label>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-medium">Location</legend>
                  <label className="input w-full">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </g>
                    </svg>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. Makeni / Freetown, Sierra Leone"
                    />
                  </label>
                </fieldset>
              </div>
              {/* Language & Skill */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-medium">Primary Language</legend>
                  <select 
                    value={formData.language} 
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })} 
                    className="select w-full"
                    required
                  >
                    <option value="" disabled>Pick your language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-medium">Mentorship Focus Area</legend>
                  <select 
                    value={formData.skill} 
                    onChange={(e) => setFormData({ ...formData, skill: e.target.value })} 
                    className="select w-full"
                    required
                  >
                    <option value="" disabled>Select mentorship focus</option>
                    {SKILLS.map((skill) => (
                      <option key={skill} value={skill.toLowerCase()}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </fieldset>
              </div>
              {/* Bio */}
              <fieldset className="fieldset mt-2">
                <legend className="fieldset-legend font-medium">Bio & Goals (Optional)</legend>
                <label className="input min-h-20 flex w-full items-start py-3">
                  <svg
                    className="h-[1em] opacity-50 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </g>
                  </svg>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="grow resize-none outline-none border-none bg-transparent"
                    placeholder="Tell mentors and peers about your aspirations, background, and what guidance you're seeking..."
                    rows="3"
                  />
                </label>
              </fieldset>
            </div>
            {/* Submit button */}
            <button type='submit' className='btn btn-primary w-full mt-4' disabled={isPending}>
              {isPending && <span className="loading loading-spinner loading-sm mr-2" />}
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage