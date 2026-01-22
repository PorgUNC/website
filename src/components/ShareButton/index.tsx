'use client'

import React, { useState } from 'react'
import { FaFacebook, FaTwitter, FaLinkedin, FaReddit, FaInstagram } from 'react-icons/fa'
import { MdEmail, MdShare, MdCheck } from 'react-icons/md'
import { FiLink } from 'react-icons/fi'

interface ShareButtonProps {
  url: string
  title: string
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false)
  const [showNativeShare, setShowNativeShare] = useState(false)

  // Checks for android or ios share menus
  React.useEffect(() => {
    setShowNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const handleCopyOrShare = async () => {
    if (showNativeShare) {
      try {
        await navigator.share({
          title: title,
          url: url,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const shareButtons = [
    {
      name: showNativeShare ? 'Share' : copied ? 'Copied!' : 'Copy Link',
      onClick: handleCopyOrShare,
      icon: showNativeShare ? (
        <MdShare className="w-4 h-4" />
      ) : copied ? (
        <MdCheck className="w-4 h-4" />
      ) : (
        <FiLink className="w-4 h-4" />
      ),
      color: copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: <FaFacebook className="w-4 h-4" />,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      icon: <FaTwitter className="w-4 h-4" />,
      color: 'bg-[#1DA1F2] hover:bg-[#1A8CD8]',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: <FaLinkedin className="w-4 h-4" />,
      color: 'bg-[#0A66C2] hover:bg-[#095196]',
    },
    {
      name: 'Reddit',
      href: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      icon: <FaReddit className="w-4 h-4" />,
      color: 'bg-[#FF4500] hover:bg-[#E03D00]',
    },
    {
      name: 'Instagram',
      href: `https://www.instagram.com/`,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        alert(
          'Instagram does not support direct URL sharing. Please share manually in the Instagram app.',
        )
      },
      icon: <FaInstagram className="w-4 h-4" />,
      color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90',
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      icon: <MdEmail className="w-4 h-4" />,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ]

  return (
    <div className="">
      <div className="flex flex-wrap gap-3">
        {shareButtons.map((button) => {
          const isLink = 'href' in button && button.href
          const commonClasses = `flex items-center justify-center w-8 h-8 rounded-full text-white transition-all ${button.color}`

          if (isLink) {
            return (
              <a
                key={button.name}
                href={button.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={button.onClick}
                className={commonClasses}
                aria-label={button.name}
                title={button.name}
              >
                {button.icon}
              </a>
            )
          }

          return (
            <button
              key={button.name}
              onClick={button.onClick}
              className={commonClasses}
              aria-label={button.name}
              title={button.name}
            >
              {button.icon}
            </button>
          )
        })}
      </div>
    </div>
  )
}
