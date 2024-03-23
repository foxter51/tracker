import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons"

export default function EditableField({value, field, type, maxLength, editing, onEdit, onChange, onSubmit, isSelf}) {

    return (
        <div className="col-3 d-flex">
            {isSelf &&
                <>
                    {editing[field] ?
                        <form onSubmit={ (e) => { onSubmit(e); onEdit(field) } } method='PATCH' className="row align-items-center">
                            <div className="col-9 ">
                                <input className="form-control"
                                    type={ type }
                                    value={ value }
                                    maxLength={ maxLength }
                                    onChange={ onChange }
                                />
                            </div>

                            <div className="col-1">
                                <button type="submit" className="btn btn-link">
                                    <FontAwesomeIcon className="float-end"
                                        icon={ faCheck }
                                    />
                                </button>
                            </div>
                        </form>
                        :
                        <div className="col-1">
                            <FontAwesomeIcon
                                icon={faPen}
                                onClick={() => onEdit(field)}
                            />
                        </div>
                    }
                </>
            }
        </div>
    )
}