import './index.scss'

export default function LoginButton() {
  return (
    <a href="/api/users/oauth/zitadel" className="login-button">
      Login
    </a>
  )
}
