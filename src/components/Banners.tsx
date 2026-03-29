interface BannersProps {
  error: string | null
  notice: string | null
}

export function Banners({ error, notice }: BannersProps) {
  return (
    <>
      {error && <div className="banner error">{error}</div>}
      {notice && <div className="banner notice">{notice}</div>}
    </>
  )
}
