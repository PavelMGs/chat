import React, { ChangeEvent, FormEvent } from 'react'

interface IForm {
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (e: FormEvent) => void
    value: string
}

const Form: React.FC<IForm> = ({ handleChange, handleSubmit, value }) => {

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={value} onChange={handleChange} />
            <input type="submit" value="submit" />
        </form>
    )
}

export default Form;
