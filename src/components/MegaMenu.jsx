import { Link } from 'react-router-dom'

export default function MegaMenu({ categories, onNavigate }) {
  return (
    <div className="mega-menu">
      <div className="mega-menu-cols">
        {categories.filter(c => !c.parent).map(top => (
          <div className="mega-menu-col" key={top.slug}>
            <Link to={`/category/${top.slug}`} className="mega-top" onClick={onNavigate}>{top.name}</Link>
            <div className="mega-children">
              {top.children.map(child => (
                <Link key={child.slug} to={`/category/${child.slug}`} onClick={onNavigate}>{child.name}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mega-menu-foot">
        <Link to="/track" onClick={onNavigate}>Track your order ↗</Link>
        <Link to="/wishlist" onClick={onNavigate}>Your wishlist ↗</Link>
      </div>
    </div>
  )
}