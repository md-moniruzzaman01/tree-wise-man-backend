export type IPostFilterRequest = {
  searchTerm?: string
}

export type IPost = {
  title: string
  content: string
  image: string
  urlLink: string
  zipCode: string
  state: string
  published: boolean
  disable: boolean
  authorId: number
}
