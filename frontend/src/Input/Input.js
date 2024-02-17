import styles from './Input.module.css'
import clsx from 'clsx';
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select';
export function Input( { onChange, type, name, value, error, placeholder } ){ 
    const style = clsx(styles.input,{
        [styles.border_input]: !error,
        [styles.border_error]: error
    })

    if(!placeholder) placeholder = name

    return(
            <input onChange={onChange}
                   type={type}
                   name={name}
                   value={value}
                   placeholder={placeholder}
                   className={style} required/>
    );
}

export function InputSelect( { options, name, create, placeholder, onChange } ){ 

    const optionsData = options.map(opt => ({value:opt, label:opt}))
    const handleChange = (selected) => {
        if(!selected?.value) selected = { value:''}
        onChange({target: { name,
                            value:selected.value}})
    }

    const handleChangeMulti = (list) => {
        onChange({target: { name,
                            value: list.map(l => l.value)}})
    }

    const selectStyles = {
        container: (baseStyles) => ({
            ...baseStyles,
            width: '100%',
            textAlign: 'start'
        }), 
        control: (baseStyles) => ({
            ...baseStyles,
            borderRadius: '20px',
        }),
      }

    return(
            <>
            {create? <CreatableSelect onChange={handleChange}
                                      isClearable 
                                      placeholder={placeholder}
                                      styles={selectStyles}
                                      name={name}
                                       /> :
            <Select onChange={handleChangeMulti}                                                                                                                       isMulti
                    isClearable
                    placeholder={placeholder}
                    options={optionsData}
                    styles={selectStyles}
                    name={name}
                    
                    />}
            </>
    );
}