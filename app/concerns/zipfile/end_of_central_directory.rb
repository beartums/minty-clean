module Zipfile

  class InvalidEndOfCentralDirectoryRecord < StandardError
    def initialize(msg = "Raw data could not be parsed")
      super
    end
  end

  class EndOfCentralDirectory
    extend Forwardable
    attr_reader :values

    SIGNATURE = '6054b50'
    PARSE_STRING = 'ls4llsa*'
    FIXED_LENGTH = 22
    KEYS = %i(signature disk_number cd_start_disk cd_records_this_disk 
              cd_records_total cd_size cd_offset comment_length comment)

    delegate KEYS => :values

    def initialize(data)
      @raw = strip_data(data)
      @values = values_struct
    end

    def strip_data(data)
      i = data.length-4
      while i >= 0 && long_hex(data[i..i+3]) != SIGNATURE
        i = i - 1
      end
      raise InvalidEndOfCentralDirectoryRecord if i < 0
      data[i..-1]
    end

    def long_hex(string)
      string.unpack('l*')[0].to_s(16)
    end

    def values_struct
      vals = @raw.unpack(PARSE_STRING)
      OpenStruct.new(KEYS.zip(vals).to_h)
    end

    def size
      FIXED_LENGTH + comment_length
    end
  end
end
