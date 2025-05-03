// components/NotFound.tsx

import { FC } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FolderPlus, Plus } from "lucide-react"
import Link from "next/link"

interface NotFoundProps {
  itemName: string
  description: string
  createLink: string
}

const NotFound: FC<NotFoundProps> = ({ itemName, description, createLink }) => {
  return (
    <Card className="text-center py-10">
      <CardHeader>
        <FolderPlus className="w-16 h-16 mx-auto text-muted-foreground mb-2" />

        <CardTitle className="text-lg font-semibold">
          No hay {itemName}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <Link href={createLink}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear {itemName}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default NotFound
