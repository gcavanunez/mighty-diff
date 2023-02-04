export const FormLabel: React.FC<
  React.LabelHTMLAttributes<HTMLLabelElement>
> = ({ className, children, ...props }) => (
  <label
    className={`${className} block text-sm font-medium text-gray-700`}
    {...props}
  >
    {children}
  </label>
);

export const FormInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ disabled = false, className = "", ...props }) => (
  <input
    disabled={disabled}
    className={`${className} rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
    {...props}
  />
);
export const FormTextarea: React.FC<
  React.InputHTMLAttributes<HTMLTextAreaElement>
> = ({ disabled = false, className = "", ...props }) => (
  <textarea
    disabled={disabled}
    className={`${className} rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
    {...props}
  />
);

export const FormInputError = ({
  messages = [],
  className = "",
}: {
  messages: string[];
  className: string;
}) => (
  <>
    {messages.length > 0 && (
      <>
        {messages.map((message, index) => (
          <p className={`${className} text-sm text-red-600`} key={index}>
            {message}
          </p>
        ))}
      </>
    )}
  </>
);
