import { AttributeTypesSection } from "@/app/components/attribute/AttributeTypesSection";
import { CreateModal } from "@/app/components/global/modals/CreateModal";
import { DeleteModal } from "@/app/components/global/modals/DeleteModal";
import { EditModal } from "@/app/components/global/modals/EditModal";
import { DeliveryMethodsSection } from "@/app/components/order/DeliveryMethodsSection";
import { ProductStatusSection } from "@/app/components/product/ProductStatusSection";
import { SocialNetworksSection } from "@/app/components/product/SocialNetworkSection";


export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6 md:grid-cols-2">
        <AttributeTypesSection />
        <DeliveryMethodsSection />
        <ProductStatusSection />
        <SocialNetworksSection />
      </div>
      <CreateModal />
      <EditModal />
      <DeleteModal />
    </div>
  )
}

