<?php

namespace NimblePHP\Modal;

use Nimblephp\Framework\Exception\NimbleException;

trait ControllerModalTrait
{

    /**
     * Modal config
     * @var array
     */
    protected array $_modalConfig = [
        'title' => null,
        'size' => null,
        'fullscreen' => false,
        'menu' => [],
        'class' => [
            'body' => '',
            'modal' => '',
            'content' => ''
        ]
    ];

    /**
     * Set modal title
     * @param string $name
     * @return void
     * @action disabled
     */
    public function setModalTitle(string $name): void
    {
        $this->_modalConfig['title'] = $name;
    }

    /**
     * Set modal size
     * @param string $size
     * @return void
     * @throws NimbleException
     * @action disabled
     */
    public function setModalSize(string $size): void
    {
        if (!in_array($size, ['xl', 'lg', 'sm'])) {
            throw new NimbleException('Avaliable modal size: xl, lg, sm', 500);
        }

        $this->_modalConfig['size'] = $size;
    }

    /**
     * Set modal fullscreen mode
     * @param bool $fullscreen
     * @return void
     * @action disabled
     */
    public function setModalFullscreen(bool $fullscreen): void
    {
        $this->_modalConfig['fullscreen'] = $fullscreen;
    }

    /**
     * Add menu to modal
     * @param string $name
     * @param string $url
     * @return void
     * @action disabled
     */
    public function addModalMenuAction(string $name, string $url = '#', string $class = ''): void
    {
        $this->_modalConfig['menu'][] = [
            'name' => $name,
            'url' => $url,
            'class' => $class
        ];
    }

    /**
     * Render modal config in header
     * @return void
     * @action disabled
     */
    public function renderModalConfigHeader(): void
    {
        header('X-Modal-Config: ' . base64_encode(json_encode($this->_modalConfig)));
    }

    /**
     * Add classes to node
     * @param string $name
     * @param string $classes
     * @return void
     * @action disabled
     */
    public function setModalClass(string $name, string $classes): void
    {
        $this->_modalConfig['class'][$name] = $classes;
    }

}