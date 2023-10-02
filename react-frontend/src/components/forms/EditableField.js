import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons"

export default function EditableField({value, field, type, maxLength, editing, onEdit, onChange, onSubmit, isSelf}) {

    return (
        <>
            {isSelf &&
                <>
                    {editing[field] ?
                        <>
                            <div className="col-2">
                                <input className="form-control"
                                       type={type}
                                       value={value}
                                       maxLength={maxLength}
                                       onChange={onChange}
                                />
                            </div>

                            <div className="col-1">
                                <FontAwesomeIcon className="float-end"
                                                 icon={faCheck}
                                                 onClick={() => {onEdit(field); onSubmit()}}
                                />
                            </div>
                        </>
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
        </>
    )
}