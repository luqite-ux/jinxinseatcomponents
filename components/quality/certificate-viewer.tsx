'use client'

import Image from 'next/image'
import { Maximize2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const alt =
  'IATF 16949:2016 certificate issued by DQS to Zhoushan Jinxin Auto Parts Co., Ltd. for the design and production of seat components'

export function CertificateViewer({ priority = false, image, buttonLabel = 'View full certificate', dialogTitle = 'IATF 16949:2016 certificate' }: { priority?: boolean; image?: { src: string; alt: string }; buttonLabel?: string; dialogTitle?: string }) {
  const source = image ?? { src: '/quality/iatf-16949-certificate.jpg', alt }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block w-full max-w-sm border border-line bg-white p-3 text-left shadow-[0_24px_50px_-30px_rgba(23,25,30,0.5)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-ink/40 md:p-4"
          aria-label={buttonLabel}
        >
          <Image
            src={source.src}
            alt={source.alt}
            width={899}
            height={1280}
            priority={priority}
            sizes="(min-width: 768px) 384px, 90vw"
            className="h-auto w-full"
          />
          <span className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm font-semibold">
            {buttonLabel}
            <Maximize2 aria-hidden className="size-4 text-jx transition-transform duration-200 group-hover:scale-110" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] w-[min(94vw,56rem)] max-w-none gap-3 overflow-y-auto bg-white p-3 sm:max-w-none md:p-5">
        <DialogTitle className="text-base">{dialogTitle}</DialogTitle>
        <DialogDescription className="sr-only">Full certificate document</DialogDescription>
        <Image
          src={source.src}
          alt={source.alt}
          width={899}
          height={1280}
          sizes="(min-width: 896px) 840px, 94vw"
          className="mx-auto h-auto w-full max-w-[44rem]"
        />
      </DialogContent>
    </Dialog>
  )
}
