'use client'

import * as React from 'react'

import { useEffect } from 'react'

import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { LayersPlusIcon, XIcon } from 'lucide-react'

import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { cn, formatNumber } from '@/lib/utils'
import { Button } from './button'
import { Spinner } from './spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { createPortal } from "react-dom"

export interface Option {
    value: string
    label: string
    description?: string
    price?: string
    disable?: boolean
    fixed?: boolean
    [key: string]: string | boolean | undefined
}
interface GroupOption {
    [key: string]: Option[]
}

interface MultipleSelectorProps {
    value?: Option[]
    defaultOptions?: Option[];

    isGettingData?: boolean

    hasAction?: boolean;
    setModal?: React.Dispatch<React.SetStateAction<boolean>>;

    options?: Option[]
    placeholder?: string

    loadingIndicator?: React.ReactNode

    emptyIndicator?: React.ReactNode

    delay?: number

    /**
     * Only work with `onSearch` prop. Trigger search when `onFocus`.
     * For example, when user click on the input, it will trigger the search to get initial options.
     **/
    triggerSearchOnFocus?: boolean

    /** async search */
    onSearch?: (value: string) => Promise<Option[]>

    /**
     * sync search. This search will not showing loadingIndicator.
     * The rest props are the same as async search.
     * i.e.: creatable, groupBy, delay.
     **/
    onSearchSync?: (value: string) => Option[]
    onChange?: (options: Option[]) => void

    /** Limit the maximum number of selected options. */
    maxSelected?: number

    /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
    onMaxSelected?: (maxLimit: number) => void

    /** Hide the placeholder when there are options selected. */
    hidePlaceholderWhenSelected?: boolean
    disabled?: boolean
    error?: boolean

    /** Group the options base on provided key. */
    groupBy?: string
    className?: string
    badgeClassName?: string

    /**
     * First item selected is a default behavior by cmdk. That is why the default is true.
     * This is a workaround solution by add a dummy item.
     *
     * @reference: https://github.com/pacocoursey/cmdk/issues/171
     */
    selectFirstItem?: boolean

    /** Allow user to create option when there is no option matched. */
    creatable?: boolean

    /** Props of `Command` */
    commandProps?: React.ComponentPropsWithoutRef<typeof Command>

    /** Props of `CommandInput` */
    inputProps?: Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'value' | 'placeholder' | 'disabled'>

    /** hide the clear all button. */
    hideClearAllButton?: boolean
}

export interface MultipleSelectorRef {
    selectedValue: Option[]
    input: HTMLInputElement
    focus: () => void
    reset: () => void
}

export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}

function transToGroupOption(options: Option[], groupBy?: string) {
    if (options.length === 0) {
        return {}
    }

    if (!groupBy) {
        return {
            '': options
        }
    }

    const groupOption: GroupOption = {}

    options.forEach(option => {
        const key = (option[groupBy] as string) || ''

        if (!groupOption[key]) {
            groupOption[key] = []
        }

        groupOption[key].push(option)
    })

    return groupOption
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
    const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption

    for (const [key, value] of Object.entries(cloneOption)) {
        cloneOption[key] = value.filter(val => !picked.find(p => p.value === val.value))
    }

    return cloneOption
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
    for (const [, value] of Object.entries(groupOption)) {
        if (value.some(option => targetOption.find(p => p.value === option.value))) {
            return true
        }
    }

    return false
}

const CommandEmpty = ({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) => {
    const render = useCommandState(state => state.filtered.count === 0)

    if (!render) return null

    return <div className={cn('px-2 py-4 text-center text-sm', className)} cmdk-empty='' role='presentation' {...props} />
}

CommandEmpty.displayName = 'CommandEmpty'

const MultipleSelector = ({
    value,
    onChange,
    placeholder,
    defaultOptions: arrayDefaultOptions = [],
    options: arrayOptions,
    delay,
    onSearch,
    onSearchSync,
    loadingIndicator,
    emptyIndicator,
    maxSelected = Number.MAX_SAFE_INTEGER,
    onMaxSelected,
    hidePlaceholderWhenSelected,
    disabled,
    groupBy,
    className,
    badgeClassName,
    selectFirstItem = true,
    creatable = false,
    triggerSearchOnFocus = false,
    commandProps,
    inputProps,
    setModal,
    hideClearAllButton = false,
    hasAction = false,
    isGettingData = false,
    error = false

}: MultipleSelectorProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false);
    const [onScrollbar, setOnScrollbar] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null) // Added this

    const [selected, setSelected] = React.useState<Option[]>(value || [])

    const [options, setOptions] = React.useState<GroupOption>(
        transToGroupOption(arrayDefaultOptions ?? [], groupBy)
    )
    const [inputValue, setInputValue] = React.useState('')
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500)

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
        ) {
            setOpen(false)
            inputRef.current.blur()
        }
    }

    const handleUnselect = React.useCallback(
        (option: Option) => {
            const newOptions = selected.filter(s => s.value !== option.value)

            setSelected(newOptions)
            onChange?.(newOptions)
        },
        [onChange, selected]
    )

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current

            if (input) {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    if (input.value === '' && selected.length > 0) {
                        const lastSelectOption = selected[selected.length - 1]

                        if (!lastSelectOption.fixed) {
                            handleUnselect(selected[selected.length - 1])
                        }
                    }
                }

                if (e.key === 'Escape') {
                    input.blur()
                }
            }
        },
        [handleUnselect, selected]
    )

    useEffect(() => {
        if (open) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('touchend', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchend', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchend', handleClickOutside)
        }
    }, [open])

    useEffect(() => {
        if (value) {
            setSelected(value)
        }
    }, [value])

    useEffect(() => {
        if (onSearch) return

        const sourceOptions = arrayOptions ?? arrayDefaultOptions ?? []
        const newOption = transToGroupOption(sourceOptions, groupBy)

        if (JSON.stringify(newOption) !== JSON.stringify(options)) {
            setOptions(newOption)
        }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options])

    useEffect(() => {
        const handleScroll = () => {
            if (open) setOpen(false)
        }

        window.addEventListener("scroll", handleScroll, true)
        return () => window.removeEventListener("scroll", handleScroll, true)
    }, [open])

    useEffect(() => {
        const doSearchSync = () => {
            const res = onSearchSync?.(debouncedSearchTerm)

            setOptions(transToGroupOption(res || [], groupBy))
        }

        const exec = async () => {
            if (!onSearchSync || !open) return

            if (triggerSearchOnFocus) {
                doSearchSync()
            }

            if (debouncedSearchTerm) {
                doSearchSync()
            }
        }

        void exec()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

    useEffect(() => {
        const doSearch = async () => {
            setIsLoading(true)
            const res = await onSearch?.(debouncedSearchTerm)

            setOptions(transToGroupOption(res || [], groupBy))
            setIsLoading(false)
        }

        const exec = async () => {
            if (!onSearch || !open) return

            if (triggerSearchOnFocus) {
                await doSearch()
            }

            if (debouncedSearchTerm) {
                await doSearch()
            }
        }

        void exec()
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

    const CreatableItem = () => {
        if (!creatable) return undefined

        if (
            isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
            selected.find(s => s.value === inputValue)
        ) {
            return undefined
        }

        const Item = (
            <CommandItem
                value={inputValue}
                className='cursor-pointer'
                onMouseDown={e => {
                    e.preventDefault()
                    e.stopPropagation()
                }}
                onSelect={(value: string) => {
                    if (selected.length >= maxSelected) {
                        onMaxSelected?.(selected.length)

                        return
                    }

                    setInputValue('')
                    const newOptions = [...selected, { value, label: value }]

                    setSelected(newOptions)
                    onChange?.(newOptions)
                }}
            >
                {`Create "${inputValue}"`}
            </CommandItem>
        )

        if (!onSearch && inputValue.length > 0) {
            return Item
        }

        if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
            return Item
        }

        return undefined
    }

    const EmptyItem = React.useCallback(() => {
        if (!emptyIndicator) return undefined

        if (onSearch && !creatable && Object.keys(options).length === 0) {
            return (
                <CommandItem value='-' disabled>
                    {emptyIndicator}
                </CommandItem>
            )
        }

        return <CommandEmpty>{emptyIndicator}</CommandEmpty>
    }, [creatable, emptyIndicator, onSearch, options])

    const selectables = React.useMemo<GroupOption>(() => removePickedOption(options, selected), [options, selected])

    const commandFilter = React.useCallback(() => {
        if (commandProps?.filter) {
            return commandProps.filter
        }

        return (value: string, search: string) => {
            const label = arrayDefaultOptions.find(o => o.value === value)?.label || ""
            return label.toLowerCase().includes(search.toLowerCase()) ? 1 : -1
        }
    }, [creatable, commandProps?.filter])

    return (
        <div className='flex gap-x-2'>
            <Command
                ref={dropdownRef}
                {...commandProps}
                onKeyDown={e => {
                    handleKeyDown(e)
                    commandProps?.onKeyDown?.(e)
                }}
                className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
                shouldFilter={commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : true}
                filter={commandFilter()}
            >
                <div
                    className={cn(
                        'border-input focus-within:border-emerald-background focus-within:ring-emerald-background/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative min-h-9.5 rounded-md border text-sm transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
                        {
                            'p-1': selected.length !== 0,
                            'cursor-text': !disabled && selected.length !== 0,
                            'ring-[3px] ring-destructive/30 border-destructive ': error

                        },
                        !hideClearAllButton && 'pr-9',
                        className
                    )}
                    onClick={() => {
                        if (disabled) return
                        inputRef?.current?.focus()
                    }}
                >
                    <div className='flex flex-wrap gap-1'>
                        {selected.map(option => {
                            return (
                                <div
                                    key={option.value}
                                    className={cn(
                                        'animate-fadeIn bg-emerald-600/10 text-emerald-background hover:bg-emerald-600/5 relative inline-flex h-7 cursor-default items-center rounded-full border-none shadow-none pr-8 pl-2 text-xs font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-fixed:pr-2',
                                        badgeClassName
                                    )}
                                    data-fixed={option.fixed}
                                    data-disabled={disabled || undefined}
                                >
                                    {arrayDefaultOptions?.find(o => o.value === option.value)?.label || option.label || option.value}
                                    <button
                                        className='text-muted-foreground/80 cursor-pointer hover:text-destructive focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -right-px flex size-7 items-center justify-center rounded-r-full border-l border-white pr-1 outline-hidden transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                handleUnselect(option)
                                            }
                                        }}
                                        onMouseDown={e => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={() => handleUnselect(option)}
                                        aria-label='Remove'
                                    >
                                        <XIcon size={14} aria-hidden='true' />
                                    </button>
                                </div>
                            )
                        })}
                        <CommandPrimitive.Input
                            {...inputProps}
                            ref={inputRef}
                            value={inputValue}
                            disabled={disabled}
                            onValueChange={value => {
                                setInputValue(value)
                                inputProps?.onValueChange?.(value)
                            }}
                            onBlur={event => {
                                if (!onScrollbar) {
                                    setOpen(false)
                                }

                                inputProps?.onBlur?.(event)
                            }}
                            onFocus={event => {
                                setOpen(true)

                                if (triggerSearchOnFocus) {
                                    onSearch?.(debouncedSearchTerm)
                                }

                                inputProps?.onFocus?.(event)
                            }}
                            placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
                            className={cn(
                                'placeholder:text-muted-foreground/70 flex-1 bg-transparent outline-hidden disabled:cursor-not-allowed',
                                {
                                    'w-full': hidePlaceholderWhenSelected,
                                    'px-3 py-2': selected.length === 0,
                                    'ml-1': selected.length !== 0
                                },
                                inputProps?.className
                            )}
                        />
                        <button
                            type='button'
                            onClick={() => {
                                setSelected(selected.filter(s => s.fixed))
                                onChange?.(selected.filter(s => s.fixed))
                            }}
                            className={cn(
                                'text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute top-0 right-0 flex size-9 items-center justify-center rounded-md border border-transparent transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
                                (hideClearAllButton ||
                                    disabled ||
                                    selected.length < 1 ||
                                    selected.filter(s => s.fixed).length === selected.length) &&
                                'hidden'
                            )}
                            aria-label='Clear all'
                        >
                            <XIcon className='size-3.5' aria-hidden='true' />
                        </button>
                    </div>
                </div>
                {open &&
                    createPortal(
                        <div
                            className="fixed z-50"
                            style={{
                                top: (dropdownRef.current?.getBoundingClientRect().bottom ?? 0) + 5,
                                left: dropdownRef.current?.getBoundingClientRect().left ?? 0,
                                width: dropdownRef.current?.offsetWidth ?? 0,
                            }}
                        >
                            <div
                                className="border-input w-full rounded-md border bg-popover shadow-lg animate-in fade-in zoom-in-95"
                            >
                                <CommandList
                                    onMouseLeave={() => setOnScrollbar(false)}
                                    onMouseEnter={() => setOnScrollbar(true)}
                                    onMouseUp={() => {
                                        inputRef?.current?.focus()
                                    }}
                                >
                                    {isGettingData ? (
                                        <div className='flex justify-center items-center py-4'>
                                            <Spinner />
                                        </div>
                                    ) : (
                                        <>
                                            {isLoading ? (
                                                <>{loadingIndicator}</>
                                            ) : (
                                                <>
                                                    {EmptyItem()}
                                                    {CreatableItem()}
                                                    {!selectFirstItem && <CommandItem value='-' className='hidden' />}
                                                    {Object.entries(selectables).map(([key, dropdowns]) => (
                                                        <CommandGroup key={key} heading={key} className='h-full overflow-auto'>
                                                            <>
                                                                {dropdowns.map(option => {
                                                                    return (
                                                                        <CommandItem
                                                                            key={option.value}
                                                                            value={option.value}
                                                                            disabled={option.disable}
                                                                            onMouseDown={e => {
                                                                                e.preventDefault()
                                                                                e.stopPropagation()
                                                                            }}
                                                                            onSelect={() => {
                                                                                if (selected.length >= maxSelected) {
                                                                                    onMaxSelected?.(selected.length)

                                                                                    return
                                                                                }

                                                                                setInputValue('')
                                                                                const newOptions = [...selected, option]

                                                                                setSelected(newOptions)
                                                                                onChange?.(newOptions)
                                                                            }}
                                                                            className={cn(
                                                                                'cursor-pointer',
                                                                                option.disable && 'pointer-events-none cursor-not-allowed opacity-50'
                                                                            )}
                                                                        >
                                                                            <Tooltip>
                                                                                <TooltipTrigger>{option.label}</TooltipTrigger>
                                                                                <TooltipContent className='max-w-lg'>
                                                                                    <p className="font-medium">{option.label}</p>
                                                                                    <pre className="whitespace-pre-wrap font-sans mb-1 leading-tight">{option.description}</pre>
                                                                                    <p className="font-medium">{formatNumber(option.price)} FCFA</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </CommandItem>
                                                                    )
                                                                })}
                                                            </>
                                                        </CommandGroup>
                                                    ))}
                                                </>
                                            )}
                                        </>
                                    )}
                                </CommandList>
                            </div>
                        </div>,
                        document.body
                    )
                }
            </Command>
            <React.Activity mode={hasAction && setModal ? "visible" : "hidden"} >
                <Button onClick={() => setModal?.(true)} type='button' variant="outline" className="h-9.5 shadow-none">
                    <LayersPlusIcon />
                </Button>
            </React.Activity>
        </div>
    )
}

MultipleSelector.displayName = 'MultipleSelector'
export default MultipleSelector
