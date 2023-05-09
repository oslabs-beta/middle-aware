import React, { useState } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface ToggleProps {
  auto: () => void
}


export default function Toggle({ auto }: ToggleProps) {
  const [enabled, setEnabled] = useState(false)

  const toggle = () => {
    setEnabled(!enabled)
    auto()
  }

  return (
    <Switch
      checked={enabled}
      onChange={toggle}
      className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none  focus:ring-offset-2"
    >
      <span className="sr-only">Toggle Auto Tests Fetching</span>
      <span aria-hidden="true" className="pointer-events-none absolute h-full w-full rounded-md bg-white" />
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'bg-[#06D6A0]' : 'bg-gray-200',
          'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out'
        )}
      />
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out'
        )}
      />
    </Switch>
  )
}

