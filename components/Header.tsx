import Link from 'next/link'
import { useState } from 'react'
import type { ReactElement } from 'react'

interface MenuItem {
  label: string
  href?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Services',
    children: [
      { label: 'Industrial Welding', href: '/services/industrial' },
      { label: 'Commercial Welding', href: '/services/commercial' },
      { label: 'Residential Welding', href: '/services/residential' },
    ],
  },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQs', href: '/faqs' },
]

interface DesktopMenuProps {
  items: MenuItem[]
}

function DesktopMenu({ items }: DesktopMenuProps): ReactElement {
  return (
    <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
      {items.map((item, index) => (
        <div key={index} className="relative group">
          {item.children ? (
            <>
              <button className="hover:text-[#ff0000] transition-colors">
                {item.label}
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white text-gray-900 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href!}
                    className={`block px-4 py-3 hover:bg-gray-100 ${
                      childIndex === 0 ? 'rounded-t-lg' : 
                      childIndex === item.children!.length - 1 ? 'rounded-b-lg' : ''
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Link href={item.href!} className="hover:text-[#ff0000] transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

interface MobileMenuItemProps {
  item: MenuItem
  onClose: () => void
  level?: number
}

function MobileMenuItem({ item, onClose, level = 0 }: MobileMenuItemProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false)

  if (item.children) {
    return (
      <div>
        <button
          className={`w-full text-left py-2 hover:text-[#ff0000] transition-colors flex items-center justify-between ${
            level > 0 ? 'pl-4' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {item.label}
          <span className="text-sm">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className="space-y-2 mt-2">
            {item.children.map((child, childIndex) => (
              <MobileMenuItem
                key={childIndex}
                item={child}
                onClose={onClose}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href!}
      className={`block py-2 hover:text-[#ff0000] transition-colors ${
        level > 0 ? 'pl-4' : ''
      }`}
      onClick={onClose}
    >
      {item.label}
    </Link>
  )
}

interface MobileMenuProps {
  items: MenuItem[]
  isOpen: boolean
  onClose: () => void
}

function MobileMenu({ items, isOpen, onClose }: MobileMenuProps): ReactElement {
  if (!isOpen) return <></>

  return (
    <div className="lg:hidden bg-[#1a2332] border-t border-gray-700">
      <nav className="px-6 py-4 space-y-3">
        {items.map((item, index) => (
          <MobileMenuItem key={index} item={item} onClose={onClose} />
        ))}
        <Link
          href="/quote"
          className="block mt-4 bg-brand-red hover:bg-[#cc0000] text-white px-6 py-3 rounded font-semibold transition-colors text-center"
          onClick={onClose}
        >
          Get a Quote
        </Link>
      </nav>
    </div>
  )
}

export default function Header(): ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="bg-brand-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight">
            <img src='/images/logo_name.png' alt='Canadian mobile welding' className='w-20 h-20' />
          </Link>
        </div>

        <DesktopMenu items={menuItems} />

        <div className="flex items-center space-x-4">
          <Link
            href="/quote"
            className="hidden md:inline-block bg-brand-red hover:bg-[#cc0000] text-white px-6 py-2 rounded font-semibold transition-colors"
          >
            Get a Quote
          </Link>
          <button
            className="lg:hidden ml-2 text-2xl"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <MobileMenu
        items={menuItems}
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </header>
  )
}
